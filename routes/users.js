const router = require('express').Router();

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

const {
  validateUserId,
  validateUpdateProfile,
} = require('../middlewares/celebrate-validator');

router.get('/me', validateUserId, getCurrentUser);
router.patch('/me', validateUpdateProfile, updateProfile);

module.exports = router;
