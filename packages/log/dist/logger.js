"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainLogger = exports.ContextLogger = exports.Logger = void 0;
const events_1 = require("events");
const styles_1 = require("./styles");
const levels_1 = require("./levels");
const winston_1 = __importDefault(require("winston"));
const triple_beam_1 = require("triple-beam");
const transports_1 = require("./transports");
const plain_style_1 = require("./styles/plain.style");
function level2winstonLevel(level) {
    switch (level) {
        case levels_1.Level.ERROR:
            return "error";
        case levels_1.Level.WARN:
            return "warn";
        case levels_1.Level.INFO:
            return "info";
        case levels_1.Level.DEBUG:
            return "debug";
        case levels_1.Level.TRACE:
            return "silly";
        default:
            return "info";
    }
}
function winstonLevel2level(level) {
    switch (level) {
        case "error":
            return levels_1.Level.ERROR;
        case "warn":
            return levels_1.Level.WARN;
        case "info":
            return levels_1.Level.INFO;
        case "http":
            return levels_1.Level.DEBUG;
        case "verbose":
            return levels_1.Level.DEBUG;
        case "debug":
            return levels_1.Level.DEBUG;
        case "silly":
            return levels_1.Level.TRACE;
        default:
            return levels_1.Level.TRACE;
    }
}
class Logger extends events_1.EventEmitter {
    constructor(module, level, style, ...transports) {
        super();
        this.module = module;
        this.level = level;
        if (transports.length === 0) {
            transports.push(transports_1.StdoutTransport());
        }
        this._logger = winston_1.default.createLogger({
            level: level2winstonLevel(this.level),
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(info => {
                const logEvent = {
                    moduleName: this.module,
                    level: winstonLevel2level(info.level),
                    message: info.message,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    args: info[triple_beam_1.SPLAT],
                    time: new Date(info.timestamp),
                    pid: process.pid,
                };
                return style.format(logEvent);
            })),
            transports: transports.map(value => new winston_1.default.transports.Stream({
                stream: value.transport(),
            })),
        });
        // add an empty error listener to prevent error being thrown, see https://nodejs.org/api/events.html#events_error_events
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.on("error", () => {
        });
    }
    error(message, ...args) {
        this.emit(levels_1.Level.ERROR.levelStr, ...args);
        this._logger.log("error", message, ...args);
    }
    info(message, ...args) {
        this.emit(levels_1.Level.INFO.levelStr, ...args);
        this._logger.log("info", message, ...args);
    }
    warn(message, ...args) {
        this.emit(levels_1.Level.WARN.levelStr, ...args);
        this._logger.log("warn", message, ...args);
    }
    debug(message, ...args) {
        this.emit(levels_1.Level.DEBUG.levelStr, ...args);
        this._logger.log("debug", message, ...args);
    }
    trace(message, ...args) {
        this.emit(levels_1.Level.TRACE.levelStr, ...args);
        this._logger.log("silly", message, ...args);
    }
}
exports.Logger = Logger;
class ContextLogger extends Logger {
    constructor(module, level = levels_1.Level.INFO, transport = transports_1.StdoutTransport()) {
        super(module, level, new styles_1.ContextStyle(transport.transport() === process.stdout), transport);
    }
}
exports.ContextLogger = ContextLogger;
class PlainLogger extends Logger {
    constructor(level = levels_1.Level.INFO, transport = transports_1.StdoutTransport()) {
        super("", level, new plain_style_1.PlainStyle(transport.transport() === process.stdout), transport);
    }
}
exports.PlainLogger = PlainLogger;
//# sourceMappingURL=logger.js.map