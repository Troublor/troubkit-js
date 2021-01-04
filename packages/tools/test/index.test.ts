import {sleep} from "../src";
import {convenientTimeString} from "../dist";

describe("sleep", () => {
    test("should sleep as expected", async () => {
        const start = new Date();
        await sleep(500);
        const end = new Date();
        const elapsed = end.getTime() - start.getTime();
        expect(elapsed).toBeGreaterThanOrEqual(450);
        expect(elapsed).toBeLessThanOrEqual(550);
    });
});

describe("convenient time string", () => {
    test("only generate date", () => {
        expect(convenientTimeString({date: true})).toMatch(/^\d\d\d\d-\d\d-\d\d$/);
    });

    test("only generate moment", () => {
        expect(convenientTimeString({moment: true})).toMatch(/^\d\d:\d\d:\d\d$/);
    });

    test("only generate millisecond (should return moment with millisecond)", () => {
        expect(convenientTimeString({moment: true, millisecond: true})).toMatch(/^\d\d:\d\d:\d\d\.\d\d\d$/);
    });

    test("generate date and moment", () => {
        expect(convenientTimeString({date: true, moment: true})).toMatch(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d$/);
    });

    test("generate date, moment and millisecond", () => {
        expect(convenientTimeString({
            date: true,
            moment: true,
            millisecond: true,
        })).toMatch(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d.\d\d\d$/);
    });
});
