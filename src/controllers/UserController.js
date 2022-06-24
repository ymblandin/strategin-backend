const User = require('../models/UserManager');
const UserValidation = require('../models/UserValidation');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

class UserController {
  static register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: 'Please specify both email and password' });
      return;
    }

    User.findOne({ email: email })
      .then(async (data) => {
        if (data.length) {
          res.status(409).send({ error: 'Email already in use' });
        } else {
          try {
            const hashPassword = await argon2.hash(password);

            const user = new User({
              email: email,
              password: hashPassword,
            });

            user
              .save()
              .then((data) => {
                res.status(200).send({ id: data._id, email: data.email });
              })
              .catch((err) => {
                console.error(err);
                res.status(500).send({ error: err.message });
              });
          } catch (err) {
            console.error(err);
            res.status(500).send({ error: err.message });
          }
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ error: err.message });
      });
  };

  static login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: 'Please specify both email and password' });
      return;
    }

    User.findOne({ email: email })
      .then(async (data) => {
        if (!data) {
          res.status(403).send({ error: 'Invalid credentials' });
        } else {
          const { id, email, password: hash } = data;

          if (await argon2.verify(hash, password)) {
            const token = jwt.sign({ id, email }, process.env.JWT_AUTH_SECRET, {
              expiresIn: 60 * 60,
            });

            res
              .cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
              })
              .status(200)
              .send({ id, email });
          } else {
            res.status(403).send({ error: 'Invalid credentials' });
          }
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ error: err.message });
      });
  };

  static browse = (req, res) => {
    User.find()
      .then((data) => {
        res.status(200).send(
          data.map((row) => {
            return { id: row._id, email: row.email };
          })
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  static authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized user' });
    }
    try {
      const data = jwt.verify(token, process.env.JWT_AUTH_SECRET);
      return next();
    } catch (err) {
      return res.status(403).send({ error: 'Operation forbidden' });
    }
  };

  static validation = async (req, res, next) => {
    try {
      await UserValidation.validate(req.body, { abortEarly: false });
      return next();
    } catch (err) {
      return res.status(400).send({ error: err });
    }
  };
}

module.exports = UserController;
