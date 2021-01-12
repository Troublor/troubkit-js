import {LogStyle} from "./style";
import {LogEvent, Printable} from "../common";
import {Colorful} from "./colorful";

export declare type MinimalStyleArg = Printable[];

export declare class MinimalStyle extends Colorful implements LogStyle<MinimalStyleArg> {
    format(loggingEvent: LogEvent<MinimalStyleArg>): string;
}
