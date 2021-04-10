"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinimalStyle = void 0;
const common_1 = require("../common");
const colorful_1 = require("./colorful");
class MinimalStyle extends colorful_1.Colorful {
    format(loggingEvent) {
        const data = Array.isArray(loggingEvent.args) ? loggingEvent.args.map(value => common_1.PrintableToString(value)).join(" ") : "";
        return `${loggingEvent.message} ${data}`.trim();
    }
}
exports.MinimalStyle = MinimalStyle;
//# sourceMappingURL=minimal.style.js.map