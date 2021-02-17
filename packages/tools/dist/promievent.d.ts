/// <reference types="node" />
import {EventEmitter} from "events";

interface Events {
    [eventName: string]: unknown[];
}

export declare type BuiltinEvents = {
    newListener: [
            string | symbol,
        (...args: unknown[]) => void
    ];
    removeListener: [
            string | symbol,
        (...args: unknown[]) => void
    ];
};

/**
 * The combination of Event Emitter and Promise.
 * Inspired by naddison36/promievent, but provide strict type specification support.
 * @see https://github.com/naddison36/promievent
 */
export declare class PromiEvent<T, E extends Events> extends EventEmitter implements Promise<T> {
    private readonly promise;
    readonly [Symbol.toStringTag]: "Promise";

    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void, emitter: PromiEvent<T, E>) => void);

    then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

    catch<TResult = never>(onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;

    finally(onFinally?: (() => void) | null | undefined): Promise<T>;

    static resolve<T>(value: T): PromiEvent<T, never>;

    static reject<T>(reason: unknown): PromiEvent<T, never>;

    addListener<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this;

    on<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this;

    once<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this;

    removeListener<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this;

    off<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this;

    removeAllListeners<K extends keyof E>(event: K extends string | symbol ? K : never): this;

    listeners<K extends keyof E>(event: K extends string | symbol ? K : never): ((...args: E[K]) => void)[];

    rawListeners<K extends keyof E>(event: K extends string | symbol ? K : never): ((...args: E[K]) => void)[];

    emit<K extends keyof E>(event: K extends string | symbol ? K : never, ...args: E[K]): boolean;

    listenerCount<K extends keyof E>(event: K extends string | symbol ? K : never): number;

    prependListener<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this;

    prependOnceListener<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this;
}

export {};
