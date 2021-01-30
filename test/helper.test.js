const { checkIfConditionIsMet } = require('../src/helpers/helperFunctions.js');

describe('checkIfConditionIsMet helper function', () => {
  it('should return true if condition is met', async () => {
    const fieldValue = 45;
    const conditionValue = 30;
    const condition = 'gte';
    const isConditionMet = checkIfConditionIsMet(
      fieldValue,
      conditionValue,
      condition,
    );

    expect(isConditionMet).toEqual(true);
  });

  it('should return false if condition is not met', async () => {
    const fieldValue = 45;
    const conditionValue = 54;
    const condition = 'gte';
    const isConditionMet = checkIfConditionIsMet(
      fieldValue,
      conditionValue,
      condition,
    );

    expect(isConditionMet).toEqual(false);
  });

  it('should throw an error if an invalid condition is passed', async () => {
    const fieldValue = 45;
    const conditionValue = 54;
    const condition = 'aaa';
    try {
      checkIfConditionIsMet(fieldValue, conditionValue, condition);
    } catch (e) {
      expect(e.statusCode).toEqual(400);
    }
  });
});
