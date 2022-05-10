import {createLogger, transports} from 'winston';

const logger = createLogger({
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
  transports: [new transports.Console()],
});

export default logger;
