const Joi = require('joi');

const selectDoctorValidationSchema = Joi.object({
    userID: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input your userID',
    }),

    doctorID: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input doctorID',
    }),
});

module.exports = selectDoctorValidationSchema;
