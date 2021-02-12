module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      email: String,
      password: String,
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
        },
      ],
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("User", schema);
};
