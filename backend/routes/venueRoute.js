const express = require('express');

const {
  createVenue,
  getAllVenues,
  getAdminVenues,
  updateVenue,
  deleteVenue,
  getVenueDetails,
} = require('../controllers/venueController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/venues').get(getAllVenues);
router
  .route('/admin/venue/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createVenue);
router
  .route('/admin/venues')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminVenues);
router
  .route('/admin/venue/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateVenue);

router
  .route('/admin/venue/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteVenue);

router.route('/venue/:id').get(getVenueDetails);

module.exports = router;
