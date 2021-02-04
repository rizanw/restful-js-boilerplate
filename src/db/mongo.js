const db = require("../models");

const startMongo = db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("⚡️[server]: Connected to the database!");
    initial();
  })
  .catch((err) => {
    console.log("⚡️[server]: Cannot connect to the database!", err);
    process.exit();
  });

function initial() {
  //initial data
}

module.exports = startMongo;
