const express = require('express');
const router = express.Router();

// Controllers & Middleware
const authController = require('../controller/authController');
const { isAdminLoggedOut, isLoggedOut } = require('../middleware/authMiddleware');

// Validation Middleware
const {
  validateUserRegister,
  validateUserLogin,
  validateAdminRegister,
  validateAdminLogin
} = require('../middleware/validation');

/**
 * User
 */
router
  .get('/login', isLoggedOut, authController.getUserLogin)
  .post('/login', isLoggedOut, validateUserLogin, authController.userLogin);

router
  .get('/register', isLoggedOut, authController.getUserRegister)
  .post('/register', isLoggedOut, validateUserRegister, authController.userRegister);

/**
 * Admin
 */
router.route('/admin/login')
  .get(isAdminLoggedOut, authController.getAdminLogin)
  .post(validateAdminLogin, authController.adminLogin);

router.route('/admin/register')
  .get(isAdminLoggedOut, authController.getAdminRegister)
  .post(validateAdminRegister, authController.adminRegister);

// Logout
router.get('/logout', authController.logout);
router.get('/admin/logout', authController.adminLogout);

module.exports = router;
