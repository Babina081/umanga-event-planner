//this is the class for sending message when an error occurs
class ErrorHandler extends Error {
  constructor(mesaage, statusCode) {
    super(mesaage);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

//exporting ErrorHandler
module.exports = ErrorHandler;
