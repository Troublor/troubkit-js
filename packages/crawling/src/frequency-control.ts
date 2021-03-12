export interface Task<T> {
    execute: () => T | PromiseLike<T>;
    callback: ((err: Error | undefined, result: T) => void) | undefined;
}

export class FrequencyControlledTaskManager {
    private readonly pendingTasks: Task<unknown>[];
    private interval: NodeJS.Timeout | undefined;

    /**
     * @param controlledPeriod the period in milliseconds that the parallelled capacity is applied.
     * @param parallelCapacity the number of tasks that can be run in parallel per controlled period.
     */
    constructor(
        private readonly controlledPeriod: number,
        private readonly parallelCapacity: number,
    ) {
        this.pendingTasks = [];
        this.interval = undefined;
    }

    start(): void {
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
                });
            }
        };
        period();
        this.interval = setInterval(period, this.controlledPeriod);
    }

    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    addTask<T>(task: Task<T>): void;
    addTask<T>(executor: () => T | PromiseLike<T>, callback?: (err: Error | undefined, result: T) => void): void;
    addTask(...args: unknown[]) {
        if (args.length < 1) {
            throw new Error("insufficient arguments");
        }
        const arg0 = args[0];
        let task = <Task<unknown>>{};
        if (typeof arg0 === "function") {
            task.execute = arg0 as () => unknown | PromiseLike<unknown>;
            task.callback = args.length >= 2 && typeof args[1] === "function" ?
                args[1] as (err: Error | undefined, result: unknown) => void : undefined;
        } else if (typeof arg0 === "object" &&
            arg0 !== null &&
            typeof (arg0 as { execute: unknown })["execute"] === "function") {
            task = arg0 as Task<unknown>;
        } else {
            throw new Error("invalid arguments");
        }
        this.pendingTasks.push(task);
    }
}
