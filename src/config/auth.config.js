require("dotenv").config();

const randHex = require("crypto").randomBytes(64).toString("hex");

module.exports = {
  secret: process.env.JWT_TOKEN || randHex,
};
