const Joi = require('joi');

exports.validateRule = {
  body: Joi.object().keys({
    rule: Joi.object()
      .required()
      .keys({
        field: Joi.string()
          .required()
          .messages({ 'any.required': 'Invalid JSON payload passed.' }),
        condition: Joi.string()
          .required()
          .valid('eq', 'neq', 'gt', 'gte', 'contains')
          .messages({ 'any.required': 'Invalid JSON payload passed.' }),
        condition_value: Joi.alternatives()
          .required()
          .try(Joi.string().allow(''), Joi.number())
          .messages({ 'any.required': 'Invalid JSON payload passed.' }),
      })
      .messages({
        'any.required': 'rule is required.',
        'object.base': 'rule should be an object.',
        'any.only': 'Invalid JSON payload passed.',
        'string.empty': 'Invalid JSON payload passed.',
        'string.base': 'Invalid JSON payload passed.',
      }),
    data: Joi.alternatives()
      .required()
      .try(Joi.string().allow(''), Joi.object(), Joi.array())
      .messages({
        'any.required': 'data is required.',
        'alternatives.types':
          'data should be either a string, object or an array.',
      }),
  }),
};
