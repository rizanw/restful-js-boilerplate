require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const config = require("./src/config");
const { connectMongo } = require("./src/db/mongo");
const { notFound, errorHandler } = require("./src/middlewares/errorHandler");
const logger = require("./src/utils/logger");

const app = express();

// secure HTTP headers
app.use(helmet());

// parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS: allow configured browser origins, and requests without an Origin
// header (curl, Postman, server-to-server)
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.app.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
  })
);

// HTTP request logging
app.use(morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } }));

app.get("/", (req, res) => {
  res.send({ success: true, message: `${config.app.name} is running` });
});

require("./src/routes/auth.routes")(app);
require("./src/routes/post.routes")(app);
require("./src/routes/user.routes")(app);

app.use(notFound);
app.use(errorHandler);

connectMongo().then(() => {
  app.listen(config.app.port, () => {
    logger.info(`⚡️[server]: Server is running at ${config.app.url}:${config.app.port}`);
  });
});
