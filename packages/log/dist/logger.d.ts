/// <reference types="node" />
import { EventEmitter } from "events";
import { ContextStyleArg } from "./styles";
import { Level } from "./levels";
import { ArgType, LogStyle } from "./styles";
import { LogTransport } from "./transports";
import { PlainStyleArg } from "./styles/plain.style";
export declare class Logger<T extends ArgType> extends EventEmitter {
    module: string;
    level: Level;
    private _logger;
    constructor(module: string, level: Level, style: LogStyle<T>, ...transports: LogTransport[]);
    error(message: string, ...args: T): void;
    info(message: string, ...args: T): void;
    warn(message: string, ...args: T): void;
    debug(message: string, ...args: T): void;
    trace(message: string, ...args: T): void;
}
export declare class ContextLogger extends Logger<ContextStyleArg> {
    constructor(module: string, level?: Level, transport?: LogTransport);
}
export declare class PlainLogger extends Logger<PlainStyleArg> {
    constructor(level?: Level, transport?: LogTransport);
}
