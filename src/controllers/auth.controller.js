require("dotenv").config();
const config = require("../config");
const db = require("../models");
const User = db.user;
const Role = db.role;
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

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({
              success: false,
              message: err,
            });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({
                success: false,
                message: err,
              });
              return;
            }
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        // if there is no role, force as user
        if (err) {
          res.status(500).send({
            success: false,
            message: err,
          });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({
              success: false,
              message: err,
            });
            return;
          }
        });
      });
    }
  });

  var authorities = [];
  for (let i = 0; i < req.body.roles.length; i++) {
    authorities.push(req.body.roles[i].toLowerCase());
  }

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
      roles: authorities,
      accessToken: token,
    },
  });
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email.toLowerCase(),
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
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

      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name);
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
          roles: authorities,
          accessToken: token,
        },
      });
    });
};
