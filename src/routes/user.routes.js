const controller = require("../controllers/user.controller");
const config = require("../config");
const { authJwt } = require("../middlewares");

const apiUri = config.api.uri;
const { verifyToken, requireRole } = authJwt;

module.exports = function (app) {
  app.get(`${apiUri}/profile`, [verifyToken], controller.getProfile);
  app.patch(`${apiUri}/change-password`, [verifyToken], controller.updatePassword);
  app.patch(`${apiUri}/change-email`, [verifyToken], controller.updateEmail);
  app.delete(`${apiUri}/profile`, [verifyToken], controller.deleteAccount);

  // superuser only
  app.get(`${apiUri}/users`, [verifyToken, ...requireRole("superuser")], controller.listUsers);
  app.patch(`${apiUri}/users/:id/roles`, [verifyToken, ...requireRole("superuser")], controller.setRoles);
};
