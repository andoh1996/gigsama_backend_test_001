/* eslint-disable prettier/prettier */
// eslint-disable-next-line no-unused-vars

const CustomError = require('../classUtils/customErrorClass');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Determining the status code (default to 500)
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Handling generated custom errors
  if (err instanceof CustomError) {
    return res.status(err.code).json({
      code: err.code,
      status: 'fail',
      message: err.message,
    });
  }

  // Send a generic message to the client 
  res.status(statusCode).json({
    code: 500,
    status: 'fail',
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    error: process.env.NODE_ENV === 'development' ? err : {}, 
  });
};

module.exports = {
  errorHandler,
};

