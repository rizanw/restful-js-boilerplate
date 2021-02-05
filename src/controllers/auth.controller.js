require("dotenv").config();
const config = require("../config");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const { SHA3 } = require("sha3");
const hash = new SHA3(512);

exports.register = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email.toLowerCase(),
    password: hash.update(req.body.password).digest("hex"),
  });
  hash.reset();

  user.save((err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
  });

  var token = jwt.sign({ id: user.id }, config.auth.secret, {
    expiresIn: 21600, // 6 hours
  });

  res.status(200).send({
    success: true,
    message: "registered successfully!",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: token,
    },
  });
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email.toLowerCase(),
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not found.",
      });
    }

    // check whatever entered password is valid or not
    var passwordIsValid =
      hash.update(req.body.password).digest("hex") == user.password;
    hash.reset();
    if (!passwordIsValid) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password!",
        data: {
          accessToken: null,
        },
      });
    }

    var token = jwt.sign({ id: user.id }, config.auth.secret, {
      expiresIn: 21600, // 6 hours
    });

    res.status(200).send({
      success: true,
      message: "logged-in successfully!",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accessToken: token,
      },
    });
  });
};
