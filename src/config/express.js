const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const httpStatus = require('http-status');
const winston = require('winston');
const routes = require('../routes');
const { logs } = require('./vars');

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        winston.error('Invalid JSON payload passed.');
        const error = new Error('Invalid JSON payload passed.');
        error.statusCode = httpStatus.BAD_REQUEST;
        error.data = null;
        throw error;
      }
    },
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// mount api routes
app.use('/', routes);

app.use((error, req, res, next) => {
  const status = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ status: 'error', message, data });
});

app.use((req, res, next) => {
  res
    .status(httpStatus.NOT_FOUND)
    .json({ status: 'error', message: 'Not a valid API route', data: null });
});

module.exports = app;
