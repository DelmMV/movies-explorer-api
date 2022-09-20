const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');
const { createUser, login, signOut } = require('../controllers/users');
const { validateSignUp, validateSignIn } = require('../middlewares/celebrate-validator');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.use(auth);
router.delete('/signout', signOut);
router.use('/users', userRouter);
router.use('/movies', moviesRouter);
router.use((req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

module.exports = router;
