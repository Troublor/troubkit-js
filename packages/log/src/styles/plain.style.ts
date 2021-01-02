import {LogStyle} from "./style";
import {LogEvent, Printable, PrintableToString} from "../common";
import {Colorful} from "./colorful";

export type PlainStyleArg = Printable[];

export class PlainStyle extends Colorful implements LogStyle<PlainStyleArg> {
    format(loggingEvent: LogEvent<PlainStyleArg>): string {
        let data = Array.isArray(loggingEvent.args) ? loggingEvent.args.map(value => PrintableToString(value)).join(" ") : "";
        return `[${this.paintColor(loggingEvent.level, loggingEvent.level.levelStr)}] ${loggingEvent.message} ${data}`.trim();
    }
}
