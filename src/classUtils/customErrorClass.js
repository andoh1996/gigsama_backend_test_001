/* eslint-disable prettier/prettier */

class CustomError extends Error {
    constructor(code, message) {
    // Call the parent class (Error) constructor
      super(message);  
      this.code = code;
    }
  }

module.exports = CustomError
  