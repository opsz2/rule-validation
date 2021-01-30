const httpStatus = require('http-status');

exports.checkIfConditionIsMet = (fieldValue, conditionValue, condition) => {
  let isConditionMet = false;
  const error = new Error(`Condition ${condition} is not valid.`);
  switch (condition) {
    case 'eq':
      isConditionMet = fieldValue === conditionValue;
      break;
    case 'neq':
      isConditionMet = fieldValue !== conditionValue;
      break;
    case 'gt':
      isConditionMet = fieldValue > conditionValue;
      break;
    case 'gte':
      isConditionMet = fieldValue >= conditionValue;
      break;
    case 'contains':
      isConditionMet = fieldValue.includes(conditionValue);
      break;
    default:
      console.log(`Condition ${condition} is not valid.`);
      error.statusCode = httpStatus.BAD_REQUEST;
      error.data = null;
      throw error;
  }
  return isConditionMet;
};
