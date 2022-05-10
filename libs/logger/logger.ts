import {createLogger, transports} from 'winston';

const logger = createLogger({
  transports: [new transports.Console()],
});

export const setDefaultLoggerMeta = (meta: Record<string, unknown>) => {
  logger.defaultMeta = meta;
};

export default logger;
