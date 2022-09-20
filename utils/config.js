require('dotenv').config();

const {
  NODE_ENV,
  JWT_SECRET,
  PORT,
  MONGO_URL,
} = process.env;

exports.PORT = NODE_ENV === 'production' ? PORT : 3001;
exports.MONGO_URL = NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/moviesdb';
exports.JWT_SECRET = NODE_ENV === 'production' ? JWT_SECRET : 'qwerty';
