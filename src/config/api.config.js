require("dotenv").config();

const api_uri = "/api/v1";

module.exports = {
  uri: process.env.API_URI || api_uri,
};
