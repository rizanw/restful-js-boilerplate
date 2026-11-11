const controller = require("../controllers/post.controller");
const config = require("../config");
const { authJwt } = require("../middlewares");

const apiUri = config.api.uri;
const { verifyToken, loadRoles } = authJwt;

module.exports = function (app) {
  app.get(`${apiUri}/posts`, controller.getAll);
  app.get(`${apiUri}/post/:id`, controller.getById);
  app.post(`${apiUri}/post`, [verifyToken], controller.create);
  app.patch(`${apiUri}/post/:id`, [verifyToken, loadRoles], controller.update);
  app.delete(`${apiUri}/post/:id`, [verifyToken, loadRoles], controller.delete);
};
