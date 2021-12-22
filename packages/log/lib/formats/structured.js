"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.structured = exports.defaultStructuredLogOptions = void 0;
const logform_1 = require("logform");
const chalk_1 = __importDefault(require("chalk"));
const triple_beam_1 = require("triple-beam");
exports.defaultStructuredLogOptions = {
    colorize: true,
};
class StructuredLogFormat {
    constructor(opts) {
        this.transform = (info) => {
            const transformedInfo = logform_1.format.metadata().transform(info, {
                key: StructuredLogFormat.METADATA_KEY,
                fillExcept: ["level", "message", "timestamp", "label"],
            });
            info = transformedInfo;
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
                    contextLiteral += `${this.paintColor(info.level, key)}=${contextValue} `;
                }
            }
            if (info.message === undefined)
                info.message = "";
            const label = info.label ? `[${info.label}]` : "";
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            info[triple_beam_1.MESSAGE] = `[${this.paintColor(info.level, info.level.toUpperCase().substring(0, 4).padEnd(4, " "))}][${logTime}]${label} ${`${info.message}`.padEnd(48, " ")} ${contextLiteral}`;
            return info;
        };
        this.opts = opts;
    }
    paintColor(level, str) {
        var _a;
        if ((_a = this.opts) === null || _a === void 0 ? void 0 : _a.colorize) {
            if (level == "silly") {
                return chalk_1.default.blue(str);
            }
            else if (level == "debug") {
                return chalk_1.default.cyan(str);
            }
            else if (level == "info") {
                return chalk_1.default.green(str);
            }
            else if (level == "warn") {
                return chalk_1.default.yellow(str);
            }
            else if (level == "error") {
                return chalk_1.default.red(str);
            }
            else {
                return str;
            }
        }
        else {
            return str;
        }
    }
}
StructuredLogFormat.METADATA_KEY = "__METADATA__";
function structured(opt = exports.defaultStructuredLogOptions) {
    opt = Object.assign({}, exports.defaultStructuredLogOptions, opt);
    return new StructuredLogFormat(opt);
}
exports.structured = structured;
//# sourceMappingURL=structured.js.map