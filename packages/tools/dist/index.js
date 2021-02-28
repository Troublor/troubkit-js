"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true, get: function () {
            return m[k];
        }
    });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.removeItem = exports.convenientTimeString = exports.sleep = void 0;
__exportStar(require("./reactive-structures"), exports);
__exportStar(require("./promievent"), exports);
__exportStar(require("./event-emitter"), exports);
async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
exports.sleep = sleep;
function convenientTimeString(options = {
    date: true,
    moment: true,
    millisecond: true,
}) {
    const now = new Date();
    let str = "";
    if (options.date) {
        str += `${now.getFullYear().toString().padStart(4, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
    }
    if (options.moment || options.millisecond) {
        str += (str.length > 0 ? " " : "") + `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    }
    if (options.millisecond) {
        str += `.${now.getMilliseconds().toString().padEnd(3, "0")}`;
    }
    return str;
}
exports.convenientTimeString = convenientTimeString;
function removeItem(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}
exports.removeItem = removeItem;
//# sourceMappingURL=index.js.map
