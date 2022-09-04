const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteClientReview,
} = require('../controllers/ReviewController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/client/review/new').put(isAuthenticatedUser, createReview);
router.route('/client/reviews').get(getAllReviews);
router.route('/client/reviews').delete(isAuthenticatedUser, deleteClientReview);

module.exports = router;
