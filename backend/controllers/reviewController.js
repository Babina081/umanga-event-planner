const Review = require('../models/reviewModel');

// importing ErrorHandler from errorHandler
const ErrorHandler = require('../utils/errorHandler');

//importing catchAsyncError
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//Create review  --ADMIN
exports.createReview = catchAsyncErrors(async (req, res, next) => {
  // req.body.user = req.user.id;
  // const review = await Review.create(req.body);
  // res.status(201).json({
  //   success: true,
  //   review,
  // });

  const { comment } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
  };

  const userReview = await Review.findById(req.query.id);

  const isReviewed = userReview.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    userReview.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        rev.comment = comment;
    });
  } else {
    userReview.push(review);
  }

  await userReview.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
  });
});

//Get All Review
exports.getAllReviews = catchAsyncErrors(async (req, res) => {
  const review = await Review.find();

  res.status(200).json({
    success: true,
    review,
  });
});

//Delete Review
exports.deleteClientReview = catchAsyncErrors(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler('Reviews not found', 400));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    message: 'Review Deleted Successfully',
  });
});
