import {ContextLogger, Level} from "../dist";
import {LogAssertion} from "./helper";
import {StreamTransport} from "../dist";

describe("ContextLogger", function () {
    let asserter: LogAssertion;
    let logger: ContextLogger;
    let tz: string | undefined;
    beforeAll(() => {
        tz = process.env.TZ;
        process.env.TZ = "GMT";
    });

    afterAll(() => {
        process.env.TZ = tz;
    });

    beforeEach(() => {
        asserter = new LogAssertion();
        logger = new ContextLogger("logger", Level.INFO, StreamTransport(asserter));
    });

    test("should handle no context", async () => {
        await asserter.expectLog(() => {
            logger.info("hello");
        }, /INFO \[.*]\[logger] hello/);
    });

    test("should show context", async () => {
        await asserter.expectLog(() => {
            logger.warn("hello", {subject: "world"});
        }, /WARN \[.*]\[logger] hello\s+subject=world/);
    });


    // test("should generate the correct date", () => { // test broken due to a potential bug in jest https://github.com/facebook/jest/issues/9856
    //     const date = new Date("2021-01-10T10:20:30Z");
    //     console.log(process.env.TZ);
    //     const style = new ContextStyle();
    //     const str = style.format({
    //         moduleName: "",
    //         level: Level.INFO,
    //         message: "test",
    //         args: [],
    //         time: date,
    //         pid: process.pid,
    //     });
    //     expect(str.trim()).toEqual("INFO [01-10|10:20:30.000][] test");
    // });
});
