const express = require('express');
const {
  newBookDecoration,
  getSingleBookDecoration,
  myDecorationBookings,
  getAllDecorationBookings,
  updateBookDecoration,
  deleteDecorationBooking,
} = require('../controllers/decorBookController');
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router
  .route('/bookDecoration/new')
  .post(isAuthenticatedUser, newBookDecoration);

router
  .route('/bookDecoration/:id')
  .get(isAuthenticatedUser, getSingleBookDecoration);

router
  .route('/bookDecorations/me')
  .get(isAuthenticatedUser, myDecorationBookings);

router
  .route('/admin/bookDecorations')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllDecorationBookings);

router
  .route('/admin/bookDecoration/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateBookDecoration);

router
  .route('/admin/bookDecoration/:id')
  .delete(
    isAuthenticatedUser,
    authorizeRoles('admin'),
    deleteDecorationBooking
  );

module.exports = router;
