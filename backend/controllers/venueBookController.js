const BookVenue = require('../models/bookVenueModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.newBookVenue = catchAsyncErrors(async (req, res, next) => {
  const {
    venueBookingInfo,
    bookVenueItems,
    paymentInfo,
    venueItemsPrice,
    totalPrice,
  } = req.body;

  const bookVenue = await BookVenue.create({
    venueBookingInfo,
    bookVenueItems,
    paymentInfo,
    venueItemsPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    bookVenue,
  });
});

exports.getSingleBookVenue = catchAsyncErrors(async (req, res, next) => {
  const bookVenue = await BookVenue.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!bookVenue) {
    return next(new ErrorHandler('Booked Venue not found with this Id', 404));
  }

  res.status(200).json({
    success: true,
    bookVenue,
  });
});

exports.myVenueBookings = catchAsyncErrors(async (req, res, next) => {
  const bookVenues = await BookVenue.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    bookVenues,
  });
});

exports.getAllVenueBookings = catchAsyncErrors(async (req, res, next) => {
  const bookVenues = await BookVenue.find();

  let totalAmount = 0;

  bookVenues.forEach((bookVenue) => {
    totalAmount += bookVenue.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    bookVenues,
  });
});

exports.updateBookVenue = catchAsyncErrors(async (req, res, next) => {
  const bookVenue = await BookVenue.findById(req.params.id);

  if (!bookVenue) {
    return next(new ErrorHandler('Venue Booking not Found with this Id', 404));
  }

  if (bookVenue.venueBookStatus === 'Completed') {
    return next(
      new ErrorHandler('You have already completed this booking ', 400)
    );
  }

  bookVenue.bookVenueStatus = req.body.status;

  if (req.body.status === 'Completed') {
    bookVenue.deliveredAt = Date.now();
  }

  await bookVenue.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

exports.deleteVenueBooking = catchAsyncErrors(async (req, res, next) => {
  const bookVenue = await BookVenue.findById(req.params.id);

  if (!bookVenue) {
    return next(new ErrorHandler('Venue Booking not Found with this Id', 404));
  }

  await bookVenue.remove();

  res.status(200).json({
    success: true,
  });
});
