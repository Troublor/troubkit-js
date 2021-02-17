import {PromiEvent} from "../src";
import {BuiltinEvents} from "../dist";

type TestEvents = {
    myEvent: [number, string];
} & BuiltinEvents;

describe("TypePromiEvent", () => {
    test("should be type-safe", (done) => {
        const promiEvent = new PromiEvent<number, TestEvents>(((resolve, reject, emitter) => {
            setTimeout(() => {
                emitter.emit("myEvent", 1, "a");
            }, 10);
            resolve(0);
        }));
        promiEvent.on("myEvent", async (abc, dd) => {
            expect(abc).toEqual(1);
            expect(dd).toEqual("a");
            const r = await promiEvent;
            expect(r).toEqual(0);
            done();
        });
    });
});
