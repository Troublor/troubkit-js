"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextStyle = void 0;
const common_1 = require("../common");
const colorful_1 = require("./colorful");
class ContextStyle extends colorful_1.Colorful {
    format(loggingEvent) {
        const month = (loggingEvent.time.getMonth() + 1).toString().padStart(2, "0");
        const day = loggingEvent.time.getDate().toString().padStart(2, "0");
        const hour = loggingEvent.time.getHours().toString().padStart(2, "0");
        const minute = loggingEvent.time.getMinutes().toString().padStart(2, "0");
        const second = loggingEvent.time.getSeconds().toString().padStart(2, "0");
        const millisecond = loggingEvent.time.getMilliseconds().toString().padEnd(3, "0").slice(0, 3);
        const logTime = `${month}-${day}|${hour}:${minute}:${second}.${millisecond}`;
        // only take the first two arguments
        const args = loggingEvent.args;
        const msg = loggingEvent.message;
        let context;
        if (!args) {
            context = {};
        }
        else {
            switch (args.length) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                case 0:
                    context = {};
                    break;
                default:
                    if (typeof args[0] === "object") {
                        context = args[0];
                    }
                    else {
                        context = { 0: common_1.PrintableToString(args[0]) };
                    }
                    break;
            }
        }
        let contextLiteral = "";
        for (const key in context) {
            if (Object.prototype.hasOwnProperty.call(context, key)) {
                const contextValue = common_1.PrintableToString(context[key]);
                contextLiteral += `${this.paintColor(loggingEvent.level, key)}=${contextValue} `;
            }
        }
        return `${this.paintColor(loggingEvent.level, loggingEvent.level.monoLenStr)}[${logTime}][${loggingEvent.moduleName}] ${msg.padEnd(48, " ")} ${contextLiteral}`;
    }
}
exports.ContextStyle = ContextStyle;
//# sourceMappingURL=context.style.js.map