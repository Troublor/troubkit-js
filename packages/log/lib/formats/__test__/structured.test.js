"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const structured_1 = require("../structured");
const console = __importStar(require("console"));
const triple_beam_1 = require("triple-beam");
describe("Structured log format", function () {
    it("should print expected format of logs in console", () => {
        const formatter = (0, structured_1.structured)({ colorize: false });
        const data = {
            level: "info",
            message: "test message",
            timestamp: new Date(),
            label: "test",
            ctx: "test ctx",
        };
        const transformed = formatter.transform(data);
        expect(typeof transformed).toEqual("object");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(transformed[triple_beam_1.MESSAGE]).toEqual(expect.stringMatching(/^\[INFO]\[[\d-:.*|]+]\[test] test message\s*ctx=test ctx.*$/));
        console.log(transformed);
    });
});
//# sourceMappingURL=structured.test.js.map