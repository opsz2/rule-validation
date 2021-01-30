const assert = require('assert');

require('dotenv-safe').load({
  path: `${__dirname}/../../.env`,
});
/**
 * config.js
 *
 * Sets up the configuration for the app depending on the node.js environment
 */

const config = {};

config.logs = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
config.env = process.env.NODE_ENV;
config.port = process.env.PORT;

assert(
  ['test', 'development', 'staging', 'production'].includes(
    process.env.NODE_ENV,
  ),
  'NODE_ENV must be one of: test, development, staging, production',
);

module.exports = config;
