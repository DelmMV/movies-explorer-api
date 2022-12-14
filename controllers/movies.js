const Movie = require("../models/movie");
const { customError } = require("../errors/customErrors");
const { DONE, CREATED } = require("../utils/statuses");
const { notFoundMessage, forbiddenMessage } = require("../utils/errorMessages");
const NotFoundError = require("../errors/notFoundError");
const ForbiddenError = require("../errors/forbiddenError");

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
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(CREATED).send(movie);
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const findMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .then((movie) => res.status(DONE).send(movie))
    .catch((err) => {
      customError(err, req, res, next);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(() => {
      throw new NotFoundError(notFoundMessage);
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenMessage);
      }
      return Movie.findByIdAndRemove(req.params._id)
        .orFail(() => {
          throw new NotFoundError(notFoundMessage);
        })
        .then((movieForDeleting) => {
          res.status(DONE).send(movieForDeleting);
        });
    })
    .catch((err) => {
      customError(err, req, res, next);
    });
};

module.exports = {
  createMovie,
  findMovies,
  deleteMovie,
};
