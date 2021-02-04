const db = require("../models");
const Post = db.post;

exports.getAll = (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    res.status(200).send({
      success: true,
      message: "succed!",
      data: posts,
    });
  });
};

exports.getById = (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    res.status(200).send({
      success: true,
      message: "succed!",
      data: post,
    });
  });
};

exports.create = (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save((err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    res.status(200).send({
      success: true,
      message: "succed!",
      data: post,
    });
  });
};

exports.update = (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }

    if (req.body.title) {
      post.title = req.body.title;
    }
    if (req.body.content) {
      post.content = req.body.content;
    }

    post.save((err) => {
      if (err) {
        res.status(500).send({
          success: false,
          message: err,
        });
        return;
      }
    });

    res.status(200).send({
      success: true,
      message: "succed!",
      data: {
        _id: post._id,
        title: req.body.title,
        content: req.body.content,
      },
    });
  });
};

exports.delete = (req, res) => {
  Post.deleteOne({ _id: req.params.id }, (err, post) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    res.status(200).send({
      success: true,
      message: "succed!",
      data: post,
    });
  });
};
