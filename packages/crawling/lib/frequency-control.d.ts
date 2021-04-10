export interface Task<T> {
    execute: () => T | PromiseLike<T>;
    callback: ((err: Error | undefined, result: T) => void) | undefined;
}
export declare class FrequencyControlledTaskManager {
    private readonly controlledPeriod;
    private readonly parallelCapacity;
    private readonly pendingTasks;
    private interval;
    /**
     * @param controlledPeriod the period in milliseconds that the parallelled capacity is applied.
     * @param parallelCapacity the number of tasks that can be run in parallel per controlled period.
     */
    constructor(controlledPeriod: number, parallelCapacity: number);
    start(): void;
    stop(): void;
    addTask<T>(task: Task<T>): void;
    addTask<T>(executor: () => T | PromiseLike<T>, callback?: (err: Error | undefined, result: T) => void): void;
}
