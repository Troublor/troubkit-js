import {Format, format, TransformableInfo, TransformFunction} from "logform";
import chalk from "chalk";
import {MESSAGE} from "triple-beam";

interface StructuredLogOptions {
    colorize?: boolean; // default: true
}

export const defaultStructuredLogOptions = {
    colorize: true,
} as StructuredLogOptions;

class StructuredLogFormat {
    static METADATA_KEY = "__METADATA__";

    private readonly opts: StructuredLogOptions;

    constructor(opts: StructuredLogOptions) {
        this.opts = opts;
    }

    private paintColor(level: string, str: string): string {
        if (this.opts?.colorize) {
            if (level == "silly") {
                return chalk.blue(str);
            } else if (level == "debug") {
                return chalk.cyan(str);
            } else if (level == "info") {
                return chalk.green(str);
            } else if (level == "warn") {
                return chalk.yellow(str);
            } else if (level == "error") {
                return chalk.red(str);
            } else {
                return str;
            }
        } else {
            return str;
        }
    }

    transform: TransformFunction = (
        info: TransformableInfo,
    ): TransformableInfo | boolean => {
        const transformedInfo = format.metadata().transform(info, {
            key: StructuredLogFormat.METADATA_KEY,
            fillExcept: ["level", "message", "timestamp", "label"],
        });
        info = transformedInfo as TransformableInfo;

        info.time = new Date();
        const month = (info.time.getMonth() + 1).toString().padStart(2, "0");
        const day = info.time.getDate().toString().padStart(2, "0");
        const hour = info.time.getHours().toString().padStart(2, "0");
        const minute = info.time.getMinutes().toString().padStart(2, "0");
        const second = info.time.getSeconds().toString().padStart(2, "0");
        const millisecond = info.time
            .getMilliseconds()
            .toString()
            .padEnd(3, "0")
            .slice(0, 3);
        const logTime = `${month}-${day}|${hour}:${minute}:${second}.${millisecond}`;

        // only take the first two arguments
        const metadata = info[StructuredLogFormat.METADATA_KEY];
        let contextLiteral = "";
        for (const key in metadata) {
            if (Object.prototype.hasOwnProperty.call(metadata, key)) {
                const contextValue = `${metadata[key]}`;
                contextLiteral += `${this.paintColor(
                    info.level,
                    key,
                )}=${contextValue} `;
            }
        }

        if (info.message === undefined) info.message = "";
        const label = info.label ? `[${info.label}]` : "";
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        info[MESSAGE] = `[${this.paintColor(
            info.level,
            info.level.toUpperCase().substring(0, 4).padEnd(4, " "),
        )}][${logTime}]${label} ${`${info.message}`.padEnd(
            48,
            " ",
        )} ${contextLiteral}`;
        return info;
    };
}

export function structured(opt: StructuredLogOptions = defaultStructuredLogOptions): Format {
    opt = Object.assign({}, defaultStructuredLogOptions, opt);
    return new StructuredLogFormat(opt);
}
