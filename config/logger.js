const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console(), new transports.File({ filename: 'auth.log' })],
});

module.exports = logger;
