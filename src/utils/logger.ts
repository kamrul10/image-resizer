import {createLogger,addColors,format,transports} from "winston";

// winston.emitErrs = true;

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    debug: "blue",
    warn: "yellow",
    data: "grey",
    info: "green",
    verbose: "cyan",
    silly: "magenta",
  },
};

const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console({
      handleExceptions: true
    }),
  ],
  levels: config.levels,
  exitOnError: false,
});
addColors(config.colors);

export default logger;
