const winston = require("winston");
const { combine, timestamp, label, printf } = winston.format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  trace: 6,
  silly: 7,
};

const loggingFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} (${level}): ${message}`;
});

const logger = winston.createLogger({
  levels: levels,
  format: combine(timestamp(), loggingFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/%DATE%-error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/%DATE%-verbose.log",
      level: "verbose",
    }),
    new winston.transports.File({ filename: "logs/%DATE%-logsfile" }),
  ],
});

module.exports = logger;
