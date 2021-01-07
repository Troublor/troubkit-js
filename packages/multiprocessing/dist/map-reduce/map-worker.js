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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {value: true});
const mapperFile = process.argv[2];
Promise.resolve().then(() => __importStar(require(mapperFile))).then(m => {
    const mapper = m.default;
    process.on("message", async (msg) => {
        var _a, _b, _c;
        if (msg.isEnd) {
            (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, {
                isEnd: true,
                data: null,
                error: null,
            });
            process.exit(0);
        }
        try {
            const mapped = await mapper(msg.data);
            (_b = process.send) === null || _b === void 0 ? void 0 : _b.call(process, {
                isEnd: false,
                data: mapped,
                error: null,
            });
        } catch (e) {
            (_c = process.send) === null || _c === void 0 ? void 0 : _c.call(process, {
                isEnd: false,
                data: msg.data,
                error: e.message,
            });
        }
    });
}).catch(e => {
    var _a;
    (_a = process.send) === null || _a === void 0 ? void 0 : _a.call(process, {
        isEnd: true,
        data: null,
        error: e.message,
    });
    process.exit(1);
});
//# sourceMappingURL=map-worker.js.map
