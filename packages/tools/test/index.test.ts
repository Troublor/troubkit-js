import {sleep} from "../src";

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
