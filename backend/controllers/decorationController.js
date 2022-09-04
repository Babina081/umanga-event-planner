//importing model of decoration
const Decoration = require('../models/decorationModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');
const cloudinary = require('cloudinary');

exports.createDecoration = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'decorations',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  req.body.user = req.user.id;

  const decoration = await Decoration.create(req.body);

  res.status(201).json({
    success: true,
    decoration,
  });
});

exports.getAllDecorations = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 20;
  const decorationsCount = await Decoration.countDocuments();
  const apiFeature = new ApiFeatures(Decoration.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const decorations = await apiFeature.query;
  res.status(200).json({
    success: true,
    decorations,
    decorationsCount,
    resultPerPage,
  });
});

exports.getAdminDecorations = catchAsyncErrors(async (req, res) => {
  const decorations = await Decoration.find();

  res.status(200).json({
    success: true,
    decorations,
  });
});

exports.getDecorationDetails = catchAsyncErrors(async (req, res, next) => {
  const decoration = await Decoration.findById(req.params.id);

  if (!decoration) {
    return next(new ErrorHandler('Decoration not found', 400));
  }

  res.status(200).json({
    success: true,
    decoration,
  });
});

exports.updateDecoration = catchAsyncErrors(async (req, res, next) => {
  let decoration = await Decoration.findById(req.params.id);

  if (!decoration) {
    return next(new ErrorHandler('Decoration not found', 400));
  }
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < decoration.images.length; i++) {
      await cloudinary.v2.uploader.destroy(decoration.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'decorations',
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }
  decoration = await Decoration.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    decoration,
  });
});

exports.deleteDecoration = catchAsyncErrors(async (req, res, next) => {
  const decoration = await Decoration.findById(req.params.id);

  if (!decoration) {
    return next(new ErrorHandler('Decoration not found', 400));
  }
  for (let i = 0; i < decoration.images.length; i++) {
    await cloudinary.v2.uploader.destroy(decoration.images[i].public_id);
  }

  await decoration.remove();

  res.status(200).json({
    success: true,
    message: 'Decoration Deleted Successfully',
  });
});
