import {EventEmitter} from "events";
import {ContextStyle, ContextStyleArg} from "./styles";
import {Level} from "./levels";
import {ArgType, LogStyle} from "./styles";
import {LogEvent} from "./common";
import winston from "winston";
import {SPLAT} from "triple-beam";
import {LogTransport, StdoutTransport} from "./transports";
import {PlainStyle, PlainStyleArg} from "./styles/plain.style";
import {MinimalStyle, MinimalStyleArg} from "./styles/minimal.style";

function level2winstonLevel(level: Level): string {
    switch (level) {
        case Level.ERROR:
            return "error";
        case Level.WARN:
            return "warn";
        case Level.INFO:
            return "info";
        case Level.DEBUG:
            return "debug";
        case Level.TRACE:
            return "silly";
        default:
            return "info";
    }
}

function winstonLevel2level(level: string): Level {
    switch (level) {
        case "error":
            return Level.ERROR;
        case "warn":
            return Level.WARN;
        case "info":
            return Level.INFO;
        case "http":
            return Level.DEBUG;
        case "verbose":
            return Level.DEBUG;
        case "debug":
            return Level.DEBUG;
        case "silly":
            return Level.TRACE;
        default:
            return Level.TRACE;
    }
}

export class Logger<T extends ArgType> extends EventEmitter {

    private _logger: winston.Logger;

    constructor(
        public module: string,
        _level: Level,
        style: LogStyle<T>,
        ...transports: LogTransport[]
    ) {
        super();
        if (transports.length === 0) {
            transports.push(StdoutTransport());
        }
        this._logger = winston.createLogger({
            level: level2winstonLevel(_level),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(info => {
                    const logEvent: LogEvent<T> = {
                        moduleName: this.module,
                        level: winstonLevel2level(info.level),
                        message: info.message,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        args: info[SPLAT] as unknown as T,
                        time: new Date(info.timestamp),
                        pid: process.pid,
                    };
                    return style.format(logEvent);
                }),
            ),
            transports: transports.map(value => new winston.transports.Stream({
                stream: value.transport(),
            })),
        });

        // add an empty error listener to prevent error being thrown, see https://nodejs.org/api/events.html#events_error_events
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.on("error", () => {
        });
    }

    public set level(lvl: Level) {
        this._logger.level = level2winstonLevel(lvl);
    }

    public get level(): Level {
        return winstonLevel2level(this._logger.level);
    }

    public get silent(): boolean {
        return this._logger.silent;
    }

    public set silent(silent: boolean) {
        this._logger.silent = silent;
    }

    public error(message: string, ...args: T): void {
        this.emit(Level.ERROR.levelStr, ...args);
        this._logger.log("error", message, ...args);
    }

    public info(message: string, ...args: T): void {
        this.emit(Level.INFO.levelStr, ...args);
        this._logger.log("info", message, ...args);
    }

    public warn(message: string, ...args: T): void {
        this.emit(Level.WARN.levelStr, ...args);
        this._logger.log("warn", message, ...args);
    }

    public debug(message: string, ...args: T): void {
        this.emit(Level.DEBUG.levelStr, ...args);
        this._logger.log("debug", message, ...args);
    }

    public trace(message: string, ...args: T): void {
        this.emit(Level.TRACE.levelStr, ...args);
        this._logger.log("silly", message, ...args);
    }
}

export class ContextLogger extends Logger<ContextStyleArg> {
    constructor(
        module: string,
        level: Level = Level.INFO,
        transport: LogTransport = StdoutTransport(),
    ) {
        super(module, level, new ContextStyle(transport.transport() === process.stdout), transport);
    }
}

export class PlainLogger extends Logger<PlainStyleArg> {
    constructor(
        level: Level = Level.INFO,
        transport: LogTransport = StdoutTransport(),
    ) {
        super("", level, new PlainStyle(transport.transport() === process.stdout), transport);
    }
}

export class MinimalLogger extends Logger<MinimalStyleArg> {
    constructor(
        level: Level = Level.INFO,
        transport: LogTransport = StdoutTransport(),
    ) {
        super("", level, new MinimalStyle(transport.transport() === process.stdout), transport);
    }
}
