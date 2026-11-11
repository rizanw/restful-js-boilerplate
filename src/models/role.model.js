module.exports = (mongoose) => {
  const schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
  });

  return mongoose.model("Role", schema);
};
