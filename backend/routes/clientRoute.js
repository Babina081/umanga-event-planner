const express = require('express');
const {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
  getClientDetails,
  getAdminClients,
  createClientReview,
  getClientReviews,
  deleteClientReview,
} = require('../controllers/clientController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/clients').get(getAllClients);
router
  .route('/admin/clients')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminClients);
router
  .route('/admin/client/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createClient);
router
  .route('/admin/client/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateClient);
router
  .route('/admin/client/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteClient);
router.route('/client/:id').get(getClientDetails);
router.route('/client/review').put(isAuthenticatedUser, createClientReview);
router.route('/client/reviews').get(getClientReviews);
router.route('/client/reviews').delete(isAuthenticatedUser, deleteClientReview);

module.exports = router;
