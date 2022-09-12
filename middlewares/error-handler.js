const { INTERNAL_SERVER_ERROR_CODE } = require('../errors/errors');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR_CODE;
  const message = statusCode === INTERNAL_SERVER_ERROR_CODE
    ? `На сервере произошла ошибка. ${err}`
    : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
