const Partner = require('../models/partnerModel');

// importing ErrorHandler from errorHandler
const ErrorHandler = require('../utils/errorHandler');

//importing catchAsyncError
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//importing apifeatures
const ApiFeatures = require('../utils/apifeatures');

//importing cloudinary
const cloudinary = require('cloudinary');

//Create Partner  --ADMIN
exports.createPartner = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'partners',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  const partner = await Partner.create(req.body);
  res.status(201).json({
    success: true,
    partner,
  });
});

//Get All Partner
exports.getAllPartners = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 8;

  const partnersCount = await Partner.countDocuments();

  const apiFeature = new ApiFeatures(Partner.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const partners = await apiFeature.query;

  res.status(200).json({
    success: true,
    partners,
    partnersCount,
    resultPerPage,
  });
});

//Get All Partner(Admin)
exports.getAdminPartners = catchAsyncErrors(async (req, res) => {
  const partners = await Partner.find();

  res.status(200).json({
    success: true,
    partners,
  });
});

//Get Partner Details
exports.getPartnerDetails = catchAsyncErrors(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);

  if (!partner) {
    return next(new ErrorHandler('Partner not found', 400));
  }

  res.status(200).json({
    success: true,
    partner,
  });
});

//Update Partner  --ADMIN
exports.updatePartner = catchAsyncErrors(async (req, res, next) => {
  //we are using let because we are changing the Partner
  //req.params.id calls the Partner as per the id of the Partner
  let partner = await Partner.findById(req.params.id);

  if (!partner) {
    return next(new ErrorHandler('Partner not found', 400));
  }
  // Images start Here
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < partner.images.length; i++) {
      await cloudinary.v2.uploader.destroy(partner.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'partners',
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  //findByIdAndUpdate find and update the Partner as per the id of the Partner
  //req.body replace the current Partner of the given id
  partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    partner,
  });
});

//Delete Partner
exports.deletePartner = catchAsyncErrors(async (req, res, next) => {
  const partner = await Partner.findById(req.params.id);

  if (!Partner) {
    return next(new ErrorHandler('Partner not found', 400));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < partner.images.length; i++) {
    await cloudinary.v2.uploader.destroy(partner.images[i].public_id);
  }

  await partner.remove();

  res.status(200).json({
    success: true,
    message: 'Partner Deleted Successfully',
  });
});
