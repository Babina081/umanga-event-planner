const Venue = require('../models/venueModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require('cloudinary');

exports.createVenue = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'venues',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  const venue = await Venue.create(req.body);
  res.status(201).json({
    success: true,
    venue,
  });
});

exports.getAllVenues = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 10;
  const venuesCount = await Venue.countDocuments();

  const apiFeature = new ApiFeatures(Venue.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  const venues = await apiFeature.query;

  res.status(200).json({
    success: true,
    venues,
    venuesCount,
    resultPerPage,
  });
});

exports.getAdminVenues = catchAsyncErrors(async (req, res) => {
  const venues = await Venue.find();

  res.status(200).json({
    success: true,
    venues,
  });
});

exports.getVenueDetails = catchAsyncErrors(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);

  if (!venue) {
    return next(new ErrorHandler('Venue not found', 400));
  }

  res.status(200).json({
    success: true,
    venue,
  });
});

exports.updateVenue = catchAsyncErrors(async (req, res, next) => {
  let venue = await Venue.findById(req.params.id);

  if (!venue) {
    return next(new ErrorHandler('Venue not found', 400));
  }

  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < venue.images.length; i++) {
      await cloudinary.v2.uploader.destroy(venue.images[i].public_id);
    }
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'venues',
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
  venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    venue,
  });
});

exports.deleteVenue = catchAsyncErrors(async (req, res, next) => {
  const venue = await Venue.findById(req.params.id);
  if (!venue) {
    return next(new ErrorHandler('Venue not found', 400));
  }

  for (let i = 0; i < venue.images.length; i++) {
    await cloudinary.v2.uploader.upload.destroy(venue.images[i].public_id);
  }

  await venue.remove();

  res.status(200).json({
    success: true,
    message: 'Venue deleted successfully',
  });
});
