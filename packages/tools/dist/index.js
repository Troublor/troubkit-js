"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.convenientTimeString = exports.sleep = void 0;
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
//# sourceMappingURL=index.js.map
