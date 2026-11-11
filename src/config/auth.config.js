const secret = process.env.JWT_SECRET || process.env.JWT_TOKEN; // JWT_TOKEN: legacy name

if (!secret) {
  // Fail fast: a random fallback secret would silently log everyone out on every restart.
  throw new Error("JWT_SECRET is not set. Copy .env.sample to .env and set JWT_SECRET.");
}

module.exports = {
  secret,
  expiresIn: process.env.JWT_EXPIRES_IN || "6h",
  saltRounds: 10,
  superuserEmails: (process.env.SUPERUSER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
};
