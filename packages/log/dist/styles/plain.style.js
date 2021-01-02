"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlainStyle = void 0;
const common_1 = require("../common");
const colorful_1 = require("./colorful");
class PlainStyle extends colorful_1.Colorful {
    format(loggingEvent) {
        const data = Array.isArray(loggingEvent.args) ? loggingEvent.args.map(value => common_1.PrintableToString(value)).join(" ") : "";
        return `[${this.paintColor(loggingEvent.level, loggingEvent.level.levelStr)}] ${loggingEvent.message} ${data}`.trim();
    }
}
exports.PlainStyle = PlainStyle;
//# sourceMappingURL=plain.style.js.map