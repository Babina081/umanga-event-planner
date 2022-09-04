const express = require('express');
const {
  newBookVenue,
  getSingleBookVenue,
  myVenueBookings,
  getAllVenueBookings,
  updateBookVenue,
  deleteVenueBooking,
} = require('../controllers/venueBookController');
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route('/bookVenue/new').post(isAuthenticatedUser, newBookVenue);

router.route('/bookVenue/:id').get(isAuthenticatedUser, getSingleBookVenue);

router.route('/bookVenues/me').get(isAuthenticatedUser, myVenueBookings);

router
  .route('/admin/bookVenues')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAllVenueBookings);

router
  .route('/admin/bookVenue/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateBookVenue);

router
  .route('/admin/bookVenue/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteVenueBooking);

module.exports = router;
