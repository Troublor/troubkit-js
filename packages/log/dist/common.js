"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrintableToString = void 0;
function PrintableToString(payload) {
    let contextValue;
    if (payload === undefined) {
        contextValue = "undefined";
    }
    else if (payload === null) {
        contextValue = "null";
    }
    else if (typeof payload === "string") {
        contextValue = payload;
    }
    else if (Object.prototype.hasOwnProperty.call(payload, "toLocalString")) {
        contextValue = payload.toLocaleString();
    }
    else if (Object.prototype.hasOwnProperty.call(payload, "toString")) {
        contextValue = payload.toLocaleString();
    }
    else {
        contextValue = payload;
    }
    return contextValue;
}
exports.PrintableToString = PrintableToString;
//# sourceMappingURL=common.js.map