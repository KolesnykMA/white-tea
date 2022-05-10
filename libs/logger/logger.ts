import type winston from 'winston';
import {createLogger, transports} from 'winston';
import {merge} from 'lodash';

type Logger = winston.Logger & {
  setDefaultMeta: (meta: Record<string, unknown>) => void;
};

const logger = createLogger({
  transports: [new transports.Console()],
});

logger.prototype.setDefaultMeta = (meta: Record<string, unknown>) => {
  merge(logger.defaultMeta, meta);
};

export default logger as Logger;
