module.exports = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      content: { type: String, default: "" },
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    {
      timestamps: true,
      toJSON: {
        transform(doc, { _id, __v, ...object }) {
          return { id: _id, ...object };
        },
      },
    }
  );

  return mongoose.model("Post", schema);
};
