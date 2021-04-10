import { LogEvent } from "../common";
export declare type ArgType = unknown[];
export interface LogStyle<T extends ArgType> {
    format: (loggingEvent: LogEvent<T>) => string;
}
