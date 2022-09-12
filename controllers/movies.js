const { OK, CREATED } = require('../errors/errors');

const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(OK).send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner = req.user._id,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неверные данные'));
      }
      return (next);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильма с указанным id не найдена'));
      }
      if (movie.owner.toString() === req.user._id.toString()) {
        return movie.remove()
          .then(() => res.status(OK).send({ message: 'Карточка фильма удалена' }));
      }
      return next(new ForbiddenError('Пользователь может удалить карточку только из своего профиля'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new NotFoundError('Фильма с указанным id не найдена'));
      }
      next(err);
      return (next);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
