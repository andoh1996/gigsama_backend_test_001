/* eslint-disable prettier/prettier */

class SuccessResponse {
  constructor(code, status, data) {
    this.code = code;
    this.status = status;
    this.data = data;
  }

  sendResponse(res) {
    return res.status(this.code).json({
      status: this.status,
      statusCode: this.code,
      data: this.data
    });
  }
}


module.exports = SuccessResponse