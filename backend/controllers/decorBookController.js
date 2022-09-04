const BookDecoration = require('../models/bookDecorationModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.newBookDecoration = catchAsyncErrors(async (req, res, next) => {
  const {
    decorationBookingInfo,
    bookDecorationItems,
    paymentInfo,
    decorationItemsPrice,
    totalPrice,
  } = req.body;

  const bookDecoration = await BookDecoration.create({
    decorationBookingInfo,
    bookDecorationItems,
    paymentInfo,
    decorationItemsPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    bookDecoration,
  });
});

exports.getSingleBookDecoration = catchAsyncErrors(async (req, res, next) => {
  const bookDecoration = await BookDecoration.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!bookDecoration) {
    return next(
      new ErrorHandler('Booked Decoration not found with this Id', 404)
    );
  }

  res.status(200).json({
    success: true,
    bookDecoration,
  });
});

exports.myDecorationBookings = catchAsyncErrors(async (req, res, next) => {
  const bookDecorations = await BookDecoration.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    bookDecorations,
  });
});

exports.getAllDecorationBookings = catchAsyncErrors(async (req, res, next) => {
  const bookDecorations = await BookDecoration.find();

  let totalAmount = 0;

  bookDecorations.forEach((bookDecoration) => {
    totalAmount += bookDecoration.totalPrice;
  });
  res.status(200).json({
    success: true,
    totalAmount,
    bookDecorations,
  });
});

exports.updateBookDecoration = catchAsyncErrors(async (req, res, next) => {
  const bookDecoration = await BookDecoration.findById(req.params.id);

  if (!bookDecoration) {
    return next(
      new ErrorHandler('Decoration Booking not Found with this Id', 404)
    );
  }

  if (bookDecoration.decorationBookStatus === 'Completed') {
    return next(
      new ErrorHandler('You have already completed this booking ', 400)
    );
  }

  bookDecoration.bookDecorationStatus = req.body.status;

  if (req.body.status === 'Completed') {
    bookDecoration.deliveredAt = Date.now();
  }

  await bookDecoration.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

exports.deleteDecorationBooking = catchAsyncErrors(async (req, res, next) => {
  const bookDecoration = await BookDecoration.findById(req.params.id);

  if (!bookDecoration) {
    return next(new ErrorHandler('Venue Booking not Found with this Id', 404));
  }

  await bookDecoration.remove();

  res.status(200).json({
    success: true,
  });
});
