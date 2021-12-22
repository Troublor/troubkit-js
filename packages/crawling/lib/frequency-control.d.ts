import {EventEmitter} from "@troubkit/tools";

export interface Task<T, M = unknown> {
    metadata: M;
    execute: () => T | PromiseLike<T>;
    callback: ((err: Error | undefined, result: T) => void) | undefined;
}

export declare type Events = {
    newTask: [Task<unknown>];
    queueEmpty: [];
};

/**
 * A task manager which schedule tasks to be executed in a specified frequency.
 * This is typical useful when invoking some APIs that have a rate limit.
 */
export declare class FrequencyControlledTaskManager extends EventEmitter<Events> {
    private readonly controlledPeriod;
    private readonly parallelCapacity;
    private readonly pendingTasks;
    private interval;

    /**
     * @param controlledPeriod the period in milliseconds that the parallelled capacity is applied.
     * @param parallelCapacity the number of tasks that can be run in parallel per controlled period.
     */
    constructor(controlledPeriod: number, parallelCapacity: number);

    private wrapAsPromise;

    /**
     * Start the task manager, which will execute task within control period and parallel capacity.
     * Tasks can be added via `addTask` method.
     */
    start(): void;

    /**
     * Stop processing more tasks.
     * Note that tasks added when the manager is stopped will be stored inside manager
     * and will be executed when manager is started again.
     */
    stop(): void;

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
    addTask<T>(executor: () => T | PromiseLike<T>): Promise<T>;
}
