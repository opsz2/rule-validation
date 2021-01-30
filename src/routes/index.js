const express = require('express');
const { validate } = require('../middlewares');

const router = express.Router();
const { validateRule } = require('../validations');
const { validateRuleController } = require('../controllers');

/**
 * GET profile
 */
router.get('/', (req, res) => {
  const response = {
    message: 'My Rule-Validation API',
    status: 'success',
    data: {
      name: 'Edet Titilope Samuel',
      github: '@opsz2',
      email: 'titilopz2@gmail.com',
      mobile: '08179020025',
      twitter: '@titilopeedet',
    },
  };
  return res.json(response);
});

router
  .route('/validate-rule')
  .post(validate(validateRule), validateRuleController);

module.exports = router;
