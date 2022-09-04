const express = require('express');
const {
  venueProcessPayment,
  sendStripeApiKey,
} = require('../controllers/venueBookPaymentController');
const router = express.Router();
const { isAuthenticatedUser } = require('../middleware/auth');

router
  .route('/bookVenue/payment/process')
  .post(isAuthenticatedUser, venueProcessPayment);

router.route('/stripeapikey').get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
