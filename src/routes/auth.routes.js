const controller = require("../controllers/auth.controller");
const config = require("../config");
const { verifyRegister } = require("../middlewares");

const apiUri = config.api.uri;

module.exports = function (app) {
  app.post(
    `${apiUri}/register`,
    [verifyRegister.validateRegister, verifyRegister.checkDuplicateEmail],
    controller.register
  );
  app.post(`${apiUri}/login`, controller.login);
};
