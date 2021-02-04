const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const startMongo = require("./src/db/mongo");

// main config
require("dotenv").config();
const PORT = process.env.APP_PORT || 8080;
const URL = process.env.APP_URL || "http://localhost";
const corsOptions = {
  origin: `${URL}:${PORT}`,
};

// start db
startMongo;

// init server
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// enabling CORS for all requests
app.use(cors(corsOptions));

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// Your route here:
app.get("/", (req, res) => {
  res.send("nothing");
});
require("./src/routes/post.routes")(app);

// starting the server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at ${URL}:${PORT}`);
});
