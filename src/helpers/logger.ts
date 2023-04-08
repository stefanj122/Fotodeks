import { createLogger, transports, format } from 'winston';
const { combine, colorize, timestamp, json } = format;

export const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'notifications-error.log',
      level: 'error',
      format: combine(colorize(), timestamp(), json()),
    }),
    new transports.File({
      filename: 'notifications.log',
      level: 'info',
      format: combine(colorize(), timestamp(), json()),
    }),
  ],
});

module.exports = logger;
