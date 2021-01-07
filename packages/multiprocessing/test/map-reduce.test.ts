import * as path from "path";
import {map} from "../dist";

describe("MapReducer", () => {
    test("should map", async () => {
        const mapped = await map([1, 2, 3, 4], path.join(__dirname, "mapper1"), 2);
        expect(mapped.sort()).toEqual([2, 3, 4, 5].sort());
    });

    test("should throw when mapper file not found", async () => {
        await expect(map([1, 2, 3, 4], path.join(__dirname, "mapper_not_exist"))).rejects.toThrow("path resolution failed");
    });

    test("should not throw when data list is empty", async () => {
        await expect(map([], path.join(__dirname, "mapper1"))).resolves.toEqual([]);
    });

    test("should work well when data is less than num of workers", async () => {
        const mapped = await map([1, 2, 3, 4], path.join(__dirname, "mapper1"), 16);
        expect(mapped.sort()).toEqual([2, 3, 4, 5].sort());
    });

    test("should throw error when mapper throws and no errHandler is provided", async () => {
        await expect(map([1, 2, 3, 4], path.join(__dirname, "mapper2"), 2)).rejects.toThrow("even pid");
    });

    test("should not throw when mapper throws and errHandler is provided", async () => {
        const mapped = await map([1, 2, 3, 4], path.join(__dirname, "mapper2"), 2, e => {
            expect(e.message).toEqual("even pid");
        });
        expect(mapped.sort()).toEqual([2, 3, 4, 5].sort());
    });

    test("should perform better than serial computation", async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const compute = require(path.join(__dirname, "mapper3"));
        const data = [1, 2, 3, 4];
        const start0 = new Date();
        await map(data, path.join(__dirname, "mapper3"), 2);
        const end0 = new Date();

        const start1 = new Date();
        for (const d of data) {
            await compute(d);
        }
        const end1 = new Date();
        expect(end1.getTime() - start1.getTime()).toBeGreaterThan(end0.getTime() - start0.getTime());
    });
});
