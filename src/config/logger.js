const { Rotate } = require('winston-logrotate');

module.exports = (serviceName, winston) => {
  const currentService = serviceName;
  let environ = process.env.NODE_ENV;
  const { configure, format } = winston;

  const customMessageFormat = format((info) => {
    const defaultMeta = {};
    defaultMeta.serviceId = currentService;
    if (environ === undefined) environ = null;
    defaultMeta.env = environ;

    // eslint-disable-next-line no-param-reassign
    info.defaultMeta = defaultMeta;

    return info;
  });

  configure({
    format: format.combine(
      format.errors({ stack: true }),
      customMessageFormat(),
    ),
    transports: [
      new Rotate({
        file: './app.log',
        colorize: true,
        timestamp: true,
        json: true,
        size: '100m',
        keep: 5,
        compress: true,
      }),
    ],
  });
};
