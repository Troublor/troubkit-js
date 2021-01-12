"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Level = void 0;
class Level {
    constructor(levelStr, levelNum) {
        this.levelStr = levelStr;
        this.levelNum = levelNum;
    }
    toString() {
        return this.levelStr;
    }
    get monoLenStr() {
        return this.levelStr.padEnd(5, " ");
    }
    geq(otherLevel) {
        return this.levelNum >= otherLevel.levelNum;
    }
    eq(otherLevel) {
        return this.levelNum === otherLevel.levelNum;
    }
}
exports.Level = Level;
Level.ERROR = new Level("ERROR", 1);
Level.WARN = new Level("WARN", 2);
Level.INFO = new Level("INFO", 3);
Level.DEBUG = new Level("DEBUG", 4);
Level.TRACE = new Level("TRACE", 5);
//# sourceMappingURL=index.js.map