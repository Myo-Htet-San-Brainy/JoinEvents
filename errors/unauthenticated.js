//const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    //this.statusCode = StatusCodes.UNAUTHORIZED;
    this.statusCode = 500;
  }
}

module.exports = UnauthenticatedError;
