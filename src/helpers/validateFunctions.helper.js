/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

const validator = require('validator')

const CustomError = require('../classUtils/customErrorClass'); 



///////////////////Validate mongoDb Id////////////////
const validateMongodbId = function (mongodbID) {
  // Trim and check if the ID is provided
  if (!mongodbID || !mongodbID.trim()) {
    throw new CustomError(400, 'Bad request, ID is required');
  }

  const trimmedID = mongodbID.trim();

  // Validate if the ID is a valid MongoDB ObjectId
  if (!ObjectId.isValid(trimmedID)) {
    throw new CustomError(400, 'Bad request, Invalid MongoDB ID');
  }

  const objectId = new ObjectId(trimmedID);
  
  return objectId;

};


const validateDoctorID = (doctorID) => {

  if (!doctorID || !doctorID.trim()) {
    throw new CustomError(400, 'Bad request, doctorID is missing');
  }

  return staffID.trim();
};

const validateUserID = (userID) => {

  if (!userID || !userID.trim()) {
    throw new CustomError(400, 'Bad request, doctorID is missing');
  }

  return userID.trim();
};


const validateQueryString = (doctorID) => {
  
  if (!string || !string.trim()) {
    throw new CustomError(400, 'Bad request, query parameter not supplied');
  }

  return string.trim();
}



module.exports = {
    validateMongodbId,
    validateDoctorID,
    validateQueryString,
    validateUserID
}