const Joi = require('joi');

const doctorValidationSchema = Joi.object({
    title: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input your title',
    }),

    firstName: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input your first name',
    }),

  lastName: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input your last name',
    }),

  email: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input email',
    }),

    department: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input department',
    }),

    specialization: Joi.string()
    .required()
    .messages({
      'string.empty': 'Please input specialization',
    }),
    

  role: Joi.string()
    .valid('doctor')
    .default('doctor')
    .messages({
      'any.only': 'Role must be "User"'
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
    })
});

module.exports = doctorValidationSchema;
