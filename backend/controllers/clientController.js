const Client = require('../models/clientModel');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middleware/catchAsyncErrors');

//importing apifeatures
const ApiFeatures = require('../utils/apifeatures');

//importing cloudinary
const cloudinary = require('cloudinary');

//Create Client  --ADMIN
exports.createClient = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'clients',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  const client = await Client.create(req.body);
  res.status(201).json({
    success: true,
    client,
  });
});

//Get All Client
exports.getAllClients = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 4;
  const clientsCount = await Client.countDocuments();

  const apiFeature = new ApiFeatures(Client.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const clients = await apiFeature.query;

  res.status(200).json({
    success: true,
    clients,
    clientsCount,
    resultPerPage,
  });
});

//Get All Clients(Admin)
exports.getAdminClients = catchAsyncErrors(async (req, res) => {
  const clients = await Client.find();

  res.status(200).json({
    success: true,
    clients,
  });
});

//Get Partner Details
exports.getClientDetails = catchAsyncErrors(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorHandler('Client not found', 400));
  }

  res.status(200).json({
    success: true,
    client,
  });
});

//Update Client  --ADMIN
exports.updateClient = catchAsyncErrors(async (req, res, next) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorHandler('Client not found', 400));
  }

  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < client.images.length; i++) {
      await cloudinary.v2.uploader.destroy(client.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: 'clients',
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    client,
  });
});

//Delete Client
exports.deleteClient = catchAsyncErrors(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new ErrorHandler('Client not found', 400));
  }

  for (let i = 0; i < client.images.length; i++) {
    await cloudinary.v2.uploader.destroy(client.images[i].public_id);
  }

  await client.remove();

  res.status(200).json({
    success: true,
    message: 'Client Deleted Successfully',
  });
});

/*******Reviews*********/

// Create New Review or Update the review in the client details
exports.createClientReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, clientId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const client = await Client.findById(clientId);

  const isReviewed = client.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    client.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    client.reviews.push(review);
    client.numOfReviews = client.reviews.length;
  }

  let avg = 0;

  client.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  client.ratings = avg / client.reviews.length;

  await client.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a client
exports.getClientReviews = catchAsyncErrors(async (req, res, next) => {
  const client = await Client.findById(req.query.id);

  if (!client) {
    return next(new ErrorHandler('Client not found', 404));
  }

  res.status(200).json({
    success: true,
    reviews: client.reviews,
  });
});

// Delete Review
exports.deleteClientReview = catchAsyncErrors(async (req, res, next) => {
  const client = await Client.findById(req.query.productId);

  if (!client) {
    return next(new ErrorHandler('Client not found', 404));
  }

  const reviews = client.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Client.findByIdAndUpdate(
    req.query.clientId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
