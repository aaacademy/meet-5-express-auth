const userController = require('../controllers/user.controller');
const { verifySignUp } = require('../middleware/auth');
const router = require('express').Router();

router.post('/signup', [
  verifySignUp.checkDuplicateEmailOrUsername,
  verifySignUp.checkRolesExist
], userController.signUp);

router.post('/signin', userController.signIn)

module.exports = router;