const db = require("../models");
const User = db.user;
const { SHA3 } = require("sha3");
const hash = new SHA3(512);

exports.getProfile = (req, res) => {
  User.findOne({ _id: req.userId }, (err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }
    console.log(user);
    res.status(200).send({
      success: true,
      message: "succeed!",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  });
};

exports.updateEmail = (req, res) => {
  User.findOne({ _id: req.userId }, (err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }

    // change the email
    if (req.body.email) {
      user.title = req.body.email;
    }

    // save changed
    user.save((err) => {
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
      message: "email has been changed!",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  });
};

exports.updatePassword = (req, res) => {
  User.findOne({ _id: req.userId }, (err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
    }

    // check whatever old password is valid or not
    var passwordIsValid =
      hash.update(req.body.oldPassword).digest("hex") == user.password;
    hash.reset();
    if (!passwordIsValid) {
      return res.status(401).send({
        success: false,
        message: "Invalid Old Password!",
      });
    }

    // change the password
    if (req.body.newPassword) {
      user.password = hash.update(req.body.newPassword).digest("hex");
      hash.reset();
    }

    // save changed
    user.save((err) => {
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
      message: "password has been changed!",
      data: {
        name: user.name,
        email: user.email,
      },
    });
  });
};

exports.deleteAccount = (req, res) => {
  User.deleteOne({ _id: req.userId }, (err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err,
      });
      return;
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
    
    res.status(200).send({
      success: true,
      message: "succeed!",
      data: {
        accessToken: null,
      },
    });
  });
};
