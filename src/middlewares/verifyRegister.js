const db = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const User = db.user;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send({ success: false, message: "name, email, and password are required." });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).send({ success: false, message: "Invalid email address." });
  }
  if (String(password).length < 8) {
    return res.status(400).send({ success: false, message: "Password must be at least 8 characters." });
  }
  next();
};

const checkDuplicateEmail = asyncHandler(async (req, res, next) => {
  const exists = await User.exists({ email: String(req.body.email).toLowerCase() });
  if (exists) {
    return res.status(409).send({ success: false, message: "Failed! Email is already in use!" });
  }
  next();
});

module.exports = { validateRegister, checkDuplicateEmail, EMAIL_PATTERN };
