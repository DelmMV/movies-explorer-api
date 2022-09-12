const router = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const { validateCreateMovie, validateMovieCardId } = require('../middlewares/celebrate-validator');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:id', validateMovieCardId, deleteMovie);

module.exports = router;
