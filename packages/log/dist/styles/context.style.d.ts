import { LogStyle } from "./style";
import { LogEvent, Printable } from "../common";
import { Colorful } from "./colorful";
export declare type ContextStyleArg = [
    context?: {
        [key: string]: Printable;
    }
];
export declare class ContextStyle extends Colorful implements LogStyle<ContextStyleArg> {
    format(loggingEvent: LogEvent<ContextStyleArg>): string;
}
