const url = process.env.APP_URL || "http://localhost";
const port = Number(process.env.APP_PORT) || 8080;

const corsOrigins = (process.env.CORS_ORIGINS || `${url}:${port}`)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  name: process.env.APP_NAME || "restful-js-boilerplate",
  url,
  port,
  corsOrigins,
};
