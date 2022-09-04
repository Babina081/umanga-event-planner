const express = require('express');
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateRole,
  deleteUser,
} = require('../controllers/userController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

//router used for registering user
router.route('/register').post(registerUser);

//router used for logging in the registered user
router.route('/login').post(loginUser);

//router used for forgot password
router.route('/password/forgot').post(forgotPassword);

//router used for resetting password
router.route('/password/reset/:token').put(resetPassword);

//router used for logging out user
router.route('/logout').get(logout);

//router used for getting details of the user
router.route('/me').get(isAuthenticatedUser, getUserDetails);

//router used for updating password
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

//router used for updating profile
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

//router used for getting all user
router
  .route('/admin/users')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllUser);

//router used for getting single user
router
  .route('/admin/user/:id')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser);

//router used for updating role
router
  .route('/admin/user/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateRole);

//router used for deleting user
router
  .route('/admin/user/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
