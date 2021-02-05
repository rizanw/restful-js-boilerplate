const controller = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");
require("dotenv").config();
const config = require("../config");

const apiUri = config.api.uri;

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(`${apiUri}/profile`, [authJwt.verifyToken], controller.getProfile);
  app.patch(
    `${apiUri}/change-password`,
    [authJwt.verifyToken],
    controller.updatePassword
  );
  app.patch(
    `${apiUri}/change-email`,
    [authJwt.verifyToken],
    controller.updateEmail
  );
  app.delete(
    `${apiUri}/profile`,
    [authJwt.verifyToken],
    controller.deleteAccount
  );
};
