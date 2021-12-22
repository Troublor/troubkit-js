import {EventEmitter} from "@troubkit/tools";

export interface Task<T, M = unknown> {
    metadata: M;
    execute: () => T | PromiseLike<T>;
    callback: ((err: Error | undefined, result: T) => void) | undefined;
}

export type Events = {
    newTask: [Task<unknown>],
    queueEmpty: [],
}

/**
 * A task manager which schedule tasks to be executed in a specified frequency.
 * This is typical useful when invoking some APIs that have a rate limit.
 */
export class FrequencyControlledTaskManager extends EventEmitter<Events> {
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
        super();
        this.pendingTasks = [];
        this.interval = undefined;
    }

    /**
     * Start the task manager, which will execute task within control period and parallel capacity.
     * Tasks can be added via `addTask` method.
     */
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
                this.wrapAsPromise(task.execute).then((r) => {
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

    /**
     * Stop processing more tasks.
     * Note that tasks added when the manager is stopped will be stored inside manager
     * and will be executed when manager is started again.
     */
    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    /**
     * Add a task to execute in the controlled period.
     * The task defines an execute function and a callback function.
     * Execute function will be called in the controlled period.
     * Callback function will be called after the task is executed.
     *
     * @param task
     */
    addTask<T>(task: Task<T>): void;

    /**
     * Add an execute function as task to execute in the controlled period.
     *
     * @param executor - a function that returns a value or promise.
     * @param callback - a function which will be called after the task is executed, whose arguments are error and result.
     */
    addTask<T>(executor: () => T | PromiseLike<T>, callback: (err: Error | undefined, result: T) => void): void;

    /**
     * Add an execute function as task to execute in the controlled period.
     *
     * @param executor - a function that returns a value or promise.
     * @return a promise which will be resolved with return value after the executor finishes, or rejected if the executor throws an exception.
     */
    async addTask<T>(executor: () => T | PromiseLike<T>): Promise<T>;

    /**
     * Implementation of addTask.
     *
     * @param args
     */
    addTask(...args: unknown[]): Promise<unknown> | void {
        if (args.length < 1) {
            throw new Error("insufficient arguments");
        }
        const arg0 = args[0];
        let task = <Task<unknown>>{};
        if (typeof arg0 === "function") {
            task.execute = arg0 as () => unknown | PromiseLike<unknown>;
            task.callback = args.length >= 2 && typeof args[1] === "function" ?
                args[1] as (err: Error | undefined, result: unknown) => void : undefined;
            if (task.callback) {
                this.pendingTasks.push(task);
                this.emit("newTask", task);
                return;
            } else {
                return new Promise<unknown>(((resolve, reject) => {
                    task.callback = (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    };
                    this.pendingTasks.push(task);
                    this.emit("newTask", task);
                }));
            }
        } else if (typeof arg0 === "object" &&
            arg0 !== null &&
            typeof (arg0 as { execute: unknown })["execute"] === "function") {
            task = arg0 as Task<unknown>;
            this.pendingTasks.push(task);
            this.emit("newTask", task);
            return;
        } else {
            throw new Error("invalid arguments");
        }
    }

    private wrapAsPromise<T>(fn: () => T | Promise<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            try {
                const ret = fn();
                if (ret instanceof Promise) {
                    ret.then(resolve).catch(reject);
                } else {
                    resolve(ret);
                }
            } catch (e) {
                reject(e);
            }
        });
    }
}
