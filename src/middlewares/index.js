const _ = require('lodash');
const Joi = require('joi');
const httpStatus = require('http-status');
const winston = require('winston');

exports.validate = (schema) => (req, res, next) => {
  const validSchema = _.pick(schema, ['body']);

  const object = _.pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object);

  if (error) {
    winston.error(error);
    const e = new Error(error.details[0].message);
    e.statusCode = httpStatus.BAD_REQUEST;
    e.data = null;
    throw e;
  }

  Object.assign(req, value);
  return next();
};
