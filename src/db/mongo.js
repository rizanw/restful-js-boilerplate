const config = require("../config");
const db = require("../models");
const logger = require("../utils/logger");

const Role = db.role;
const User = db.user;

async function connectMongo() {
  try {
    await db.mongoose.connect(db.url);
    logger.info("⚡️[server]: Connected to the database!");
    await seedRoles();
    await promoteSuperusers();
  } catch (err) {
    logger.error(`⚡️[server]: Cannot connect to the database! ${err.message}`);
    process.exit(1);
  }
}

// create the declared roles if they don't exist yet
async function seedRoles() {
  for (const name of db.ROLES) {
    const result = await Role.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
    if (result.upsertedCount) logger.info(`⚡️[mongo]: added '${name}' to roles collection`);
  }
}

// give the superuser role to existing accounts listed in SUPERUSER_EMAILS
async function promoteSuperusers() {
  if (!config.auth.superuserEmails.length) return;
  const superuser = await Role.findOne({ name: "superuser" });
  const result = await User.updateMany(
    { email: { $in: config.auth.superuserEmails } },
    { $addToSet: { roles: superuser._id } }
  );
  if (result.modifiedCount) logger.info(`⚡️[mongo]: promoted ${result.modifiedCount} user(s) to superuser`);
}

module.exports = { connectMongo };
