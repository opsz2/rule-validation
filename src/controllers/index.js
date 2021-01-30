const httpStatus = require('http-status');
const { checkIfConditionIsMet } = require('../helpers/helperFunctions.js');

exports.validateRuleController = (req, res, next) => {
  const { rule, data } = req.body;
  // eslint-disable-next-line camelcase
  const { field, condition, condition_value } = rule;

  let fieldValue = data;

  field.split('.').forEach((value, index) => {
    if (index > 2) {
      const e = new Error(
        `invalid field ${field}. Only 2 levels of nested object supported.`,
      );
      e.statusCode = httpStatus.BAD_REQUEST;
      e.data = null;
      throw e;
    }
    if (fieldValue[value]) {
      fieldValue = fieldValue[value];
      return;
    }

    fieldValue = undefined;
  });

  if (fieldValue === undefined) {
    const e = new Error(`field ${field} is missing from data.`);
    e.statusCode = httpStatus.BAD_REQUEST;
    e.data = null;
    throw e;
  }

  const isConditionMet = checkIfConditionIsMet(
    fieldValue,
    condition_value,
    condition,
  );

  const response = {
    message: `field ${field} successfully validated.`,
    status: 'success',
    data: {
      validation: {
        error: false,
        field,
        field_value: fieldValue,
        condition,
        condition_value,
      },
    },
  };

  if (!isConditionMet) {
    response.message = `field ${field} failed validation.`;
    response.status = 'error';
    response.data.validation.error = true;

    return res.status(httpStatus.BAD_REQUEST).json(response);
  }

  return res.json(response);
};
