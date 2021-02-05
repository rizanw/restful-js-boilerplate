const config = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthenticated!" });
    }
    req.userId = decoded.id;
    console.log(decoded);
    next();
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
