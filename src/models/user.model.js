module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: String,
      email: String,
      password: String,
    },
    { timestamps: true }
  );

  return mongoose.model("User", schema);
};
