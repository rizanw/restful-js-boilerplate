const logger = require("../utils/logger");

const notFound = (req, res) => {
  res.status(404).send({ success: false, message: "Route not found." });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).send({ success: false, message: "Invalid JSON body." });
  }
  if (err.name === "ValidationError") {
    return res.status(400).send({ success: false, message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(404).send({ success: false, message: "Not found." });
  }
  if (err.code === 11000) {
    return res.status(409).send({ success: false, message: "Resource already exists." });
  }

  // don't leak internals to the client
  logger.error(err.stack || String(err));
  res.status(500).send({ success: false, message: "Internal server error." });
};

module.exports = { notFound, errorHandler };
