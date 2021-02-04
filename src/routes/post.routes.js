const controller = require("../controllers/post.controller");
require("dotenv").config();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(`${process.env.API_URI}/posts`, controller.getAll);
  app.get(`${process.env.API_URI}/post/:id`, controller.getById);
  app.post(`${process.env.API_URI}/api/post`, controller.create);
  app.patch(`${process.env.API_URI}/post/:id`, controller.update);
  app.delete(`${process.env.API_URI}/post/:id`, controller.delete);
};
