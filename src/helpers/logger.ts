import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  transports: [
    new transports.File({
      filename: 'notifications-error.log',
      level: 'error',
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.json(),
      ),
    }),
    new transports.File({
      filename: 'notifications.log',
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.json(),
      ),
    }),
  ],
});

module.exports = logger;
