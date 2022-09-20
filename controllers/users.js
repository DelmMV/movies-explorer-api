const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = require('../utils/config');
const { OK, CREATED } = require('../errors/errors');

const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw next(new NotFoundError('Пользователь c заданным id не найден'));
      } else {
        res.status(OK).send(user);
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError('Пользователь c таким email существует'));
      }
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({ email, password: hash, name })
            .then((userData) => {
              res.status(CREATED).send({
                data: {
                  name: userData.name,
                  email: userData.email,
                },
              });
            })
            .catch(next);
        });
      return (next);
    })
    .catch(next);
  return (next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверный логин или пароль'));
      }
      bcrypt.compare(password, user.password, ((err, isValid) => {
        if (err || !isValid) {
          return next(new UnauthorizedError('Неверный логин или пароль'));
        }
        if (isValid) {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-key',
            { expiresIn: '7d' },
          );
          res.send({ token });
        }
        return (next);
      }));
      return (next);
    })
    .catch(next);
};

const signOut = (req, res) => {
  if (req.cookies) {
    res
      .status(OK)
      .clearCookie('jwt', {
        sameSite: 'None',
        secure: true,
      })
      .send({ message: 'Успешный выход из приложения' });
  }
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id, { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Невалидные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Email уже используется другим пользователем'));
      }
      return next(err);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  signOut,
  updateProfile,
};
