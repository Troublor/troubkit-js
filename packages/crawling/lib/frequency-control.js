"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrequencyControlledTaskManager = void 0;
const tools_1 = require("@troubkit/tools");
class FrequencyControlledTaskManager extends tools_1.EventEmitter {
    /**
     * @param controlledPeriod the period in milliseconds that the parallelled capacity is applied.
     * @param parallelCapacity the number of tasks that can be run in parallel per controlled period.
     */
    constructor(controlledPeriod, parallelCapacity) {
        super();
        this.controlledPeriod = controlledPeriod;
        this.parallelCapacity = parallelCapacity;
        this.pendingTasks = [];
        this.interval = undefined;
    }
    start() {
        const period = () => {
            for (let i = 0; i < this.parallelCapacity; i++) {
                if (this.pendingTasks.length <= 0) {
                    return;
                }
                const task = this.pendingTasks.shift();
                if (!task) {
                    continue;
                }
                Promise.resolve(task.execute()).then((r) => {
                    task.callback && task.callback(undefined, r);
                }).catch(err => {
                    task.callback && task.callback(err, undefined);
                }).finally(() => {
                    if (this.pendingTasks.length <= 0) {
                        this.emit("queueEmpty");
                    }
                });
            }
        };
        period();
        this.interval = setInterval(period, this.controlledPeriod);
    }
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    addTask(...args) {
        if (args.length < 1) {
            throw new Error("insufficient arguments");
        }
        const arg0 = args[0];
        let task = {};
        if (typeof arg0 === "function") {
            task.execute = arg0;
            task.callback = args.length >= 2 && typeof args[1] === "function" ?
                args[1] : undefined;
        }
        else if (typeof arg0 === "object" &&
            arg0 !== null &&
            typeof arg0["execute"] === "function") {
            task = arg0;
        }
        else {
            throw new Error("invalid arguments");
        }
        this.pendingTasks.push(task);
        this.emit("newTask", task);
    }
}
exports.FrequencyControlledTaskManager = FrequencyControlledTaskManager;
//# sourceMappingURL=frequency-control.js.map