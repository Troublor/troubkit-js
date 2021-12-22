import {structured} from "../structured";
import {TransformableInfo} from "logform";
import {MESSAGE} from "triple-beam";

describe("Structured log format", function () {
    it("should print expected format of logs in console", () => {
        const formatter = structured({colorize: false});
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
        expect((transformed as TransformableInfo)[MESSAGE]).toEqual(expect.stringMatching(/^\[INFO]\[[\d-:.*|]+]\[test] test message\s*ctx=test ctx.*$/));
    });
});
