import {FrequencyControlledTaskManager} from "../frequency-control";
import {sleep} from "@troubkit/tools";

describe("FrequencyControlledTaskManager", () => {
    let manager: FrequencyControlledTaskManager;

    beforeEach(() => {
        manager = new FrequencyControlledTaskManager(100, 1);
    });

    afterEach(() => {
        manager.stop();
    });

    test("should emit newTask event when new task is added", (done) => {
        manager.start();
        manager.on("newTask", task => {
            expect(task.metadata).toEqual("test");
            done();
        });
        manager.addTask({
            metadata: "test",
            execute: () => 1 + 1,
            callback: () => 2 + 2,
        });
    });

    test("should emit queueEmpty event after all tasks have been processed", (done) => {
        manager.start();
        let executed = false;
        manager.on("queueEmpty", () => {
            expect(executed).toBeTruthy();
            done();
        });
        manager.addTask({
            metadata: "test",
            execute: () => executed = true,
            callback: undefined,
        });
    });

    test("should not execute task before start", async () => {
        let executed = false;
        manager.addTask({
            metadata: "test",
            execute: () => executed = true,
            callback: undefined,
        });
        await sleep(200);
        expect(executed).toBeFalsy();
    });

    test("should not execute task after stop", async () => {
        let executed = false;
        manager.start();
        manager.addTask({
            metadata: "test",
            execute: () => executed = true,
            callback: undefined,
        });
        await sleep(200);
        expect(executed).toBeTruthy();

        executed = false;
        manager.stop();
        manager.addTask({
            metadata: "test",
            execute: () => executed = true,
            callback: undefined,
        });
        await sleep(200);
        expect(executed).toBeFalsy();
    });

    test("should return void if callback is provided", () => {
        manager.start();
        return Promise.all([
            new Promise(resolve => {
                const ret = manager.addTask(
                    () => 1,
                    (err, result) => {
                        expect(err).toBeUndefined();
                        expect(result).toBe(1);
                        resolve(null);
                    },
                );
                expect(ret).toBeUndefined();
            }),
            new Promise(resolve => {
                const ret = manager.addTask(
                    () => {
                        throw new Error("err");
                    },
                    (err, result) => {
                        expect(err?.message).toEqual("err");
                        expect(result).toBeUndefined();
                        resolve(null);
                    },
                );
                expect(ret).toBeUndefined();
            }),
        ]);
    });

    test("should return a promise if callback is not provided", async () => {
        manager.start();
        const aPromise = manager.addTask(
            () => 1,
        );
        expect(aPromise).toBeInstanceOf(Promise);
        await expect(aPromise).resolves.toBe(1);

        const promise = manager.addTask(
            () => new Promise(r => r(1)),
        );
        expect(promise).toBeInstanceOf(Promise);
        await expect(promise).resolves.toBe(1);

        const rejectPromise = manager.addTask(
            () => Promise.reject(new Error("err")),
        );
        await expect(rejectPromise).rejects.toThrow("err");
    });
});
