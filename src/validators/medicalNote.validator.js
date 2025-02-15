const Joi = require('joi');

const medicalNoteValidationSchema = Joi.object({
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

    note: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input medical note',
    }),
});

module.exports = medicalNoteValidationSchema;
