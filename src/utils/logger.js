const winston = require("winston");
const { combine, timestamp, printf } = winston.format;

const loggingFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} (${level}): ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "http",
  format: combine(timestamp(), loggingFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

module.exports = logger;
