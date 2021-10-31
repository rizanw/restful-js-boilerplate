const db = require("../models");
const logger = require("../utils/logger");
const Role = db.role;

const startMongo = db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("⚡️[server]: Connected to the database!");
    initial();
  })
  .catch((err) => {
    logger.error("⚡️[server]: Cannot connect to the database!");
    logger.verbose(err);
    process.exit();
  });

function initial() {
  //initial data
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "superuser",
      }).save((err) => {
        if (err) {
          logger.error("⚡️[mongo]: " + err);
        }

        logger.info("⚡️[mongo]: added 'superuser' to roles collection");
      });

      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          logger.error("⚡️[mongo]: " + err);
        }

        logger.info("⚡️[mongo]: added 'user' to roles collection");
      });
    }
  });
}

module.exports = startMongo;
