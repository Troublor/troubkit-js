import {FrequencyControlledTaskManager} from "../lib";
import {sleep} from "@troubkit/tools";

describe("FrequencyControlledTaskManager", () => {
    let manager: FrequencyControlledTaskManager;

    beforeEach(()=>{
        manager = new FrequencyControlledTaskManager(100, 1);
    });

    afterEach(()=>{
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

    test("should not execute task after stop", async ()=>{
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

});