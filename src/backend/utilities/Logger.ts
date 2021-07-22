import winston from 'winston';

const Config = require('../../../config/config');

const fileLogFormat = winston.format.combine(
    winston.format.printf((info) => {
        const date = new Date();
        const printTime = `${date.getDate()} ${date.getMonth()} ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
        return `${printTime}| ${info.message}`;
    }),
);

export default class Logger {
    static log: any;
    static error: any;
    static request: any;
    static db: any;
}

const infoLogger = winston.createLogger({
    level: 'debug',
    format: fileLogFormat,
    transports: [
        new winston.transports.File({ filename: Config.Path.Root.Logs.INFO }),
    ],
    maxsize: 1 << 20,
    maxFiles: 128,
});

const dbLogger = winston.createLogger({
    level: 'debug',
    format: fileLogFormat,
    transports: [
        new winston.transports.File({ filename: Config.Path.Root.Logs.DB }),
    ],
    maxsize: 1 << 20,
    maxFiles: 128,
});

const errorLogger = winston.createLogger({
    level: 'error',
    format: fileLogFormat,
    transports: [
        new winston.transports.File({ filename: Config.Path.Root.Logs.ERROR, level: 'error' }),
    ],
    maxsize: 1 << 20,
    maxFiles: 1024,
});

const requestsLogger = winston.createLogger({
    level: 'info',
    format: fileLogFormat,
    transports: [
        new winston.transports.File({ filename: Config.Path.Root.Logs.REQUESTS }),
    ],
    maxsize: 1 << 20,
    maxFiles: 128,
});

if (Config.Build.PRODUCTION !== true) {
    infoLogger.add(new winston.transports.Console({
        'format': winston.format.combine(
            winston.format.printf((info) => info.message),
        ),
    }));
    errorLogger.add(new winston.transports.Console({
        'format': winston.format.combine(
            winston.format.printf((info) => info.message),
        ),
    }));
}

Logger.log = (...args_) => {
    const args = args_.map(argvMapper);
    infoLogger.info(args.join(' '));
};

Logger.db = (...args_) => {
    const args = args_.map(argvMapper);
    dbLogger.info(args.join(' '));
};

Logger.error = (...args_) => {
    const args = args_.map(argvMapper);
    errorLogger.error(args.join(' '));
};

Logger.request = (...args_) => {
    const args = args_.map(argvMapper);
    requestsLogger.info(args.join(' '));
};

function argvMapper(argv) {
    if (argv instanceof Error) {
        return [argv.name, argv.message, argv.stack].join('\r\n');
    }
    return typeof (argv) === 'string' ? argv : JSON.stringify(argv);
}
