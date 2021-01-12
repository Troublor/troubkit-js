import {LogStyle} from "./style";
import {LogEvent, Printable, PrintableToString} from "../common";
import {Colorful} from "./colorful";

export type MinimalStyleArg = Printable[];

export class MinimalStyle extends Colorful implements LogStyle<MinimalStyleArg> {
    format(loggingEvent: LogEvent<MinimalStyleArg>): string {
        const data = Array.isArray(loggingEvent.args) ? loggingEvent.args.map(value => PrintableToString(value)).join(" ") : "";
        return `${loggingEvent.message} ${data}`.trim();
    }
}
