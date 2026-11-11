const db = require("../models");
const asyncHandler = require("../utils/asyncHandler");

const Post = db.post;

const notFound = (res) => res.status(404).send({ success: false, message: "Post not found." });

// Only the author or a superuser may change a post.
const canModify = (req, post) =>
  post.author.equals(req.userId) || req.userRoles.includes("superuser");

exports.getAll = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "name");
  res.status(200).send({ success: true, message: "succeed!", data: posts });
});

exports.getById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name");
  if (!post) return notFound(res);
  res.status(200).send({ success: true, message: "succeed!", data: post });
});

exports.create = asyncHandler(async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    author: req.userId,
  });
  res.status(201).send({ success: true, message: "succeed!", data: post });
});

exports.update = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return notFound(res);
  if (!canModify(req, post)) {
    return res.status(403).send({ success: false, message: "You can only edit your own posts." });
  }

  if (req.body.title !== undefined) post.title = req.body.title;
  if (req.body.content !== undefined) post.content = req.body.content;
  await post.save();

  res.status(200).send({ success: true, message: "succeed!", data: post });
});

exports.delete = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return notFound(res);
  if (!canModify(req, post)) {
    return res.status(403).send({ success: false, message: "You can only delete your own posts." });
  }

  await post.deleteOne();
  res.status(200).send({ success: true, message: "succeed!", data: { id: post.id } });
});
