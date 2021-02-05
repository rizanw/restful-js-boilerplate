const controller = require("../controllers/post.controller");
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

  app.get(`${apiUri}/posts`, controller.getAll);
  app.get(`${apiUri}/post/:id`, controller.getById);
  app.post(`${apiUri}/post`, [authJwt.verifyToken], controller.create);
  app.patch(`${apiUri}/post/:id`, [authJwt.verifyToken], controller.update);
  app.delete(`${apiUri}/post/:id`, [authJwt.verifyToken], controller.delete);
};
