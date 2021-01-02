"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colorful = void 0;
const chalk_1 = __importDefault(require("chalk"));
const levels_1 = require("../levels");
class Colorful {
    constructor(colorful = false) {
        this.colorful = colorful;
    }
    paintColor(level, str) {
        if (this.colorful) {
            if (level.eq(levels_1.Level.TRACE)) {
                return chalk_1.default.blue(str);
            }
            else if (level.eq(levels_1.Level.DEBUG)) {
                return chalk_1.default.cyan(str);
            }
            else if (level.eq(levels_1.Level.INFO)) {
                return chalk_1.default.green(str);
            }
            else if (level.eq(levels_1.Level.WARN)) {
                return chalk_1.default.yellow(str);
            }
            else if (level.eq(levels_1.Level.ERROR)) {
                return chalk_1.default.red(str);
            }
            else if (level.eq(levels_1.Level.FATAL)) {
                return chalk_1.default.magenta(str);
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
exports.Colorful = Colorful;
//# sourceMappingURL=colorful.js.map