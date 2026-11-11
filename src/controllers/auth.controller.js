const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const User = db.user;
const Role = db.role;

const signToken = (user) =>
  jwt.sign({ id: user.id }, config.auth.secret, { expiresIn: config.auth.expiresIn });

// New accounts always get the "user" role. Roles sent in the request body are
// ignored, so nobody can register themselves as a superuser.
exports.register = asyncHandler(async (req, res) => {
  const userRole = await Role.findOne({ name: "user" });
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(String(req.body.password), config.auth.saltRounds),
    roles: [userRole._id],
  });

  res.status(201).send({
    success: true,
    message: "registered successfully!",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: ["user"],
      accessToken: signToken(user),
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ success: false, message: "email and password are required." });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() })
    .select("+password")
    .populate("roles", "name");

  // same response for unknown email and wrong password, so accounts can't be enumerated
  const valid = user && (await bcrypt.compare(String(password), user.password));
  if (!valid) {
    return res.status(401).send({ success: false, message: "Invalid email or password." });
  }

  res.status(200).send({
    success: true,
    message: "logged-in successfully!",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      accessToken: signToken(user),
    },
  });
});
