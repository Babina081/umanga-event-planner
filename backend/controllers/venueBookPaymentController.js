const catchAsyncErrors = require('../middleware/catchAsyncErrors');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//creating a secret key for the payment process
exports.venueProcessPayment = catchAsyncErrors(async (req, res, next) => {
  const myVenuePayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'npr',
    metadata: {
      company: 'Umanga',
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myVenuePayment.client_secret });
});

//sending the api key to frontend
exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
