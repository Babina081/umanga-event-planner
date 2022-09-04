//importing model of gallery
const Gallery = require('../models/galleryModel');

// importing ErrorHandler from errorHandler
const ErrorHandler = require('../utils/errorHandler');

//importing catchAsyncError
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//importing apiFeatures
const ApiFeatures = require('../utils/apifeatures');

//importing cloudinary
const cloudinary = require('cloudinary');

// const Formidable = require('formidable');

//Create Gallery  --ADMIN
exports.createGallery = catchAsyncErrors(async (req, res, next) => {
  const { image } = req.body;

  // let images = [];

  // if (typeof req.body.images === 'string') {
  //   images.push(req.body.images);
  // } else {
  //   images = req.body.images;
  // }

  // const imagesLinks = [];

  // for (let i = 0; i < images.length; i++) {
  //   const result = await cloudinary.v2.uploader.upload(images[i], {
  //     folder: 'gallery',
  //   });

  //   imagesLinks.push({
  //     public_id: result.public_id,
  //     url: result.secure_url,
  //   });
  // }

  // req.body.images = imagesLinks;

  // req.body.user = req.user.id;
  const result = await cloudinary.uploader.upload(image, {
    folder: 'gallery',
    width: 300,
    crop: 'scale',
  });
  const gallery = await Gallery.create({
    image: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    gallery,
  });
});

//Get All Gallery
exports.getAllGalleries = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 20;

  const galleriesCount = await Gallery.countDocuments();

  const apiFeature = new ApiFeatures(Gallery.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const galleries = await apiFeature.query;

  res.status(200).json({
    success: true,
    galleries,
    galleriesCount,
    resultPerPage,
  });
});

//Get All Galleries(Admin)
exports.getAdminGalleries = catchAsyncErrors(async (req, res) => {
  const galleries = await Gallery.find();

  res.status(200).json({
    success: true,
    galleries,
  });
});

//Get Gallery Details
exports.getGalleryDetails = catchAsyncErrors(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return next(new ErrorHandler('Gallery not found', 400));
  }
  res.status(200).json({
    success: true,
    gallery,
  });
});

//Update Gallery  --ADMIN
exports.updateGallery = catchAsyncErrors(async (req, res, next) => {
  let gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return next(new ErrorHandler('Gallery not found', 400));
  }

  //Image start here
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < gallery.images.length; i++) {
      await cloudinary.v2.uploader.destroy(gallery.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'gallery',
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  //findByIdAndUpdate find and update the gallery as per the id of the gallery
  //req.body replace the current gallery of the given id
  gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    gallery,
  });
});

//Delete Gallery
exports.deleteGallery = catchAsyncErrors(async (req, res, next) => {
  const gallery = await Gallery.findById(req.params.id);

  if (!gallery) {
    return next(new ErrorHandler('Gallery not found', 400));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < gallery.images.length; i++) {
    await cloudinary.v2.uploader.destroy(gallery.images[i].public_id);
  }

  await gallery.remove();

  res.status(200).json({
    success: true,
    message: 'Gallery Deleted Successfully',
  });
});
