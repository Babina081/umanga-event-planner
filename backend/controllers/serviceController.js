const Service = require('../models/serviceModel');

// importing ErrorHandler from errorHandler
const ErrorHandler = require('../utils/errorHandler');

//importing catchAsyncError
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//importing apifeatures
const ApiFeatures = require('../utils/apifeatures');

//importing cloudinary
const cloudinary = require('cloudinary');

//Create service  --ADMIN
exports.createService = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'services',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    service,
  });
});

//Get All Service
exports.getAllServices = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 12;

  const servicesCount = await Service.countDocuments();

  //the first parameter is query
  //the second parameter is queryStr
  const apiFeature = new ApiFeatures(Service.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const services = await apiFeature.query;

  // let services = await apiFeature.query;
  // let filteredServicesCount = services.length;
  // apiFeature.pagination(resultPerPage);
  // services = await apiFeature.query;

  res.status(200).json({
    success: true,
    services,
    servicesCount,
    resultPerPage,
    // filteredServicesCount,
  });
});

//Get All Products(Admin)
exports.getAdminServices = catchAsyncErrors(async (req, res) => {
  const services = await Service.find();

  res.status(200).json({
    success: true,
    services,
  });
});

//Get Service Details
exports.getServiceDetails = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHandler('Services not found', 400));
  }
  res.status(200).json({
    success: true,
    service,
  });
});

//Update Service  --ADMIN
exports.updateService = catchAsyncErrors(async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHandler('Services not found', 400));
  }

  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < service.images.length; i++) {
      await cloudinary.v2.uploader.destroy(service.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'services',
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    service,
  });
});

//Delete Service
exports.deleteService = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorHandler('Services not found', 400));
  }

  for (let i = 0; i < service.images.length; i++) {
    await cloudinary.v2.uploader.destroy(service.images[i].public_id);
  }

  await service.remove();

  res.status(200).json({
    success: true,
    message: 'Service Deleted Successfully',
  });
});
