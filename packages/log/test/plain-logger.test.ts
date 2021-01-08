import {Level} from "../dist";
import {PlainLogger} from "../dist";
import {StreamTransport} from "../dist";
import {LogAssertion} from "./helper";

describe("PlainLogger", function () {
    test("should filter log levels", async () => {
        const writable = new LogAssertion();
        const transport = StreamTransport(writable);
        const logger = new PlainLogger(Level.INFO, transport);
        await writable.expectLog(() => {
            logger.error("ERROR");
        }, "[ERROR] ERROR");
        await writable.expectLog(() => {
            logger.warn("WARN");
        }, "[WARN] WARN");
        await writable.expectLog(() => {
            logger.info("INFO");
        }, "[INFO] INFO");
        await writable.expectNoLog(() => {
            logger.debug("DEBUG");
        });
        await writable.expectNoLog(() => {
            logger.trace("TRACE");
        });
    });
});
