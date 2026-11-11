const bcrypt = require("bcryptjs");
const config = require("../config");
const db = require("../models");
const { EMAIL_PATTERN } = require("../middlewares/verifyRegister");
const asyncHandler = require("../utils/asyncHandler");

const User = db.user;
const Role = db.role;

const profile = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  roles: user.roles.map((role) => role.name ?? role),
});

const findWithPassword = (id) => User.findById(id).select("+password").populate("roles", "name");

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate("roles", "name");
  if (!user) return res.status(404).send({ success: false, message: "User not found." });
  res.status(200).send({ success: true, message: "succeed!", data: profile(user) });
});

exports.updateEmail = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").toLowerCase().trim();
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).send({ success: false, message: "A valid email is required." });
  }
  if (await User.exists({ email, _id: { $ne: req.userId } })) {
    return res.status(409).send({ success: false, message: "Email is already in use!" });
  }

  const user = await User.findById(req.userId).populate("roles", "name");
  if (!user) return res.status(404).send({ success: false, message: "User not found." });
  user.email = email;
  await user.save();

  res.status(200).send({ success: true, message: "email has been changed!", data: profile(user) });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || String(newPassword).length < 8) {
    return res.status(400).send({
      success: false,
      message: "oldPassword and newPassword (at least 8 characters) are required.",
    });
  }

  const user = await findWithPassword(req.userId);
  if (!user || !(await bcrypt.compare(String(oldPassword), user.password))) {
    return res.status(401).send({ success: false, message: "Invalid old password!" });
  }

  user.password = await bcrypt.hash(String(newPassword), config.auth.saltRounds);
  await user.save();

  res.status(200).send({ success: true, message: "password has been changed!", data: profile(user) });
});

// Checks the password first, then deletes the account.
exports.deleteAccount = asyncHandler(async (req, res) => {
  const user = await findWithPassword(req.userId);
  if (!user || !(await bcrypt.compare(String(req.body.password || ""), user.password))) {
    return res.status(401).send({ success: false, message: "Invalid password!" });
  }

  await user.deleteOne();
  res.status(200).send({ success: true, message: "account deleted.", data: { accessToken: null } });
});

// --- superuser only ---------------------------------------------------------

exports.listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate("roles", "name").sort({ createdAt: -1 });
  res.status(200).send({ success: true, message: "succeed!", data: users.map(profile) });
});

exports.setRoles = asyncHandler(async (req, res) => {
  const names = req.body.roles;
  if (!Array.isArray(names) || names.length === 0 || !names.every((n) => db.ROLES.includes(n))) {
    return res.status(400).send({ success: false, message: `roles must be a non-empty array of: ${db.ROLES.join(", ")}` });
  }

  const roles = await Role.find({ name: { $in: names } });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { roles: roles.map((role) => role._id) },
    { new: true }
  ).populate("roles", "name");
  if (!user) return res.status(404).send({ success: false, message: "User not found." });

  res.status(200).send({ success: true, message: "roles updated.", data: profile(user) });
});
