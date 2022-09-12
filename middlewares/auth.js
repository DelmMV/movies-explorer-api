const jwt = require('jsonwebtoken');

const { NODE_ENV } = process.env;
const { JWT_SECRET } = NODE_ENV === 'production'
  ? process.env
  : require('dotenv').config();
const UnauthorizedError = require('../errors/unauthorized-error');

const auth = (req, res, next) => {
  const token = req.headers.autharization;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
  return (next);
};

module.exports = auth;
