module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      password: { type: String, required: true, select: false },
      roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    },
    {
      timestamps: true,
      // expose `id` instead of `_id`, and never the password hash
      toJSON: {
        transform(doc, { _id, __v, password, ...object }) {
          return { id: _id, ...object };
        },
      },
    }
  );

  return mongoose.model("User", schema);
};
