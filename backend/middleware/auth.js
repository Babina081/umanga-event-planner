const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//exporting directly to authenticated the user logged in
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  //call the token stored in the  cookie
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler('Please login to access this resource', 401));
  }

  //variable verify the token generated with the jwt secret
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

//function for checking the roles authorized (admin or user)
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role:  ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
