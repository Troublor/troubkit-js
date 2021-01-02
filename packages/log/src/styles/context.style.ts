import {LogStyle} from "./style";
import {LogEvent, Printable, PrintableToString} from "../common";
import {Colorful} from "./colorful";

export type ContextStyleArg = [
    context?: { [key: string]: Printable },
]

export class ContextStyle extends Colorful implements LogStyle<ContextStyleArg> {
    format(loggingEvent: LogEvent<ContextStyleArg>): string {
        const month = loggingEvent.time.getMonth().toString().padStart(2, "0");
        const day = loggingEvent.time.getDay().toString().padStart(2, "0");
        const hour = loggingEvent.time.getHours().toString().padStart(2, "0");
        const minute = loggingEvent.time.getMinutes().toString().padStart(2, "0");
        const second = loggingEvent.time.getSeconds().toString().padStart(2, "0");
        const millisecond = loggingEvent.time.getMilliseconds().toString().padEnd(3, "0").slice(0, 3);
        const logTime = `${month}-${day}|${hour}:${minute}:${second}.${millisecond}`;

        // only take the first two arguments
        const args = loggingEvent.args;
        const msg: string = loggingEvent.message;
        let context: { [key: string]: Printable };
        if (!args) {
            context = {};
        } else {
            switch (args.length) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                case 0:
                    context = {};
                    break;
                default:
                    if (typeof args[0] === "object") {
                        context = args[0];
                    } else {
                        context = {0: PrintableToString(args[0] as Printable)};
                    }
                    break;
            }
        }

        let contextLiteral = "";
        for (const key in context) {
            if (Object.prototype.hasOwnProperty.call(context, key)) {
                const contextValue = PrintableToString(context[key]);
                contextLiteral += `${this.paintColor(loggingEvent.level, key)}=${contextValue} `;
            }
        }
        return `${this.paintColor(loggingEvent.level, loggingEvent.level.monoLenStr)}[${logTime}][${loggingEvent.moduleName}] ${msg.padEnd(48, " ")} ${contextLiteral}`;
    }
}
