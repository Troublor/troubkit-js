import {Level, MinimalLogger} from "../lib";
import {StreamTransport} from "../lib";
import {LogAssertion} from "./helper";

describe("MinimalLogger", function () {
    test("should able to change levels", async () => {
        const writable = new LogAssertion();
        const transport = StreamTransport(writable);
        const logger = new MinimalLogger(Level.INFO, transport);
        await writable.expectLog(() => {
            logger.info("info log");
        }, "info log");
        logger.level = Level.ERROR;
        await writable.expectNoLog(() => {
            logger.info("info log");
        });
    });

    test("should be silent", async () => {
        const writable = new LogAssertion();
        const transport = StreamTransport(writable);
        const logger = new MinimalLogger(Level.INFO, transport);
        await writable.expectLog(() => {
            logger.info("info log");
        }, "info log");
        logger.silent = true;
        await writable.expectNoLog(() => {
            logger.info("info log");
        });
    });
});
