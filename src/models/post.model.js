module.exports = (mongoose) => {
  const schema = mongoose.Schema({
    title: String,
    content: String,
  });

  return mongoose.model("Post", schema);
};
