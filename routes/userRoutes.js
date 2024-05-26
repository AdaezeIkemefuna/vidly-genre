const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/').get(authController.protect, getAllUsers).post(createUser);
router.route(':id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
