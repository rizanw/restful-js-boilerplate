const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const User = db.user;

// Requires "Authorization: Bearer <token>" and sets req.userId.
const verifyToken = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).send({ success: false, message: "No token provided!" });
  }

  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ success: false, message: "Unauthenticated!" });
    }
    req.userId = decoded.id;
    next();
  });
};

// Loads the user's roles into req.userRoles. Use after verifyToken.
const loadRoles = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId).populate("roles", "name");
  if (!user) {
    return res.status(401).send({ success: false, message: "Unauthenticated!" });
  }
  req.userRoles = user.roles.map((role) => role.name);
  next();
});

// Allows the request only if the user has at least one of the given roles.
const requireRole = (...roles) => [
  loadRoles,
  (req, res, next) => {
    if (roles.some((role) => req.userRoles.includes(role))) return next();
    return res.status(403).send({ success: false, message: `Requires role: ${roles.join(" or ")}` });
  },
];

module.exports = { verifyToken, loadRoles, requireRole };
