import { LogStyle } from "./style";
import { LogEvent, Printable } from "../common";
import { Colorful } from "./colorful";
export declare type PlainStyleArg = Printable[];
export declare class PlainStyle extends Colorful implements LogStyle<PlainStyleArg> {
    format(loggingEvent: LogEvent<PlainStyleArg>): string;
}
