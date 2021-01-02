import {ContextLogger, Level} from "../src";
import {LogAssertion} from "./helper";
import {StreamTransport} from "../src";

describe("ContextLogger", function () {
    let asserter: LogAssertion;
    let logger: ContextLogger;
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
});
