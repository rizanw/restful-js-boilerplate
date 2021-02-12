const controller = require("../controllers/auth.controller");
require("dotenv").config();
const config = require("../config");
const verifyRegister = require("../middlewares/verifyRegister");

const apiUri = config.api.uri;

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    `${apiUri}/register`,
    [verifyRegister.checkDuplicateEmail, verifyRegister.checkRolesExisted],
    controller.register
  );
  app.post(`${apiUri}/login`, controller.login);
};
