import {EventEmitter} from "events";

interface Events {
    // event name => argument type list
    [eventName: string]: unknown[];
}

export type BuiltinEvents = {
    newListener: [
            string | symbol,
        (...args: unknown[]) => void,
    ];

    removeListener: [
            string | symbol,
        (...args: unknown[]) => void,
    ]
}

/**
 * The combination of Event Emitter and Promise.
 * Inspired by naddison36/promievent, but provide strict type specification support.
 * @see https://github.com/naddison36/promievent
 */
export class PromiEvent<T, E extends Events> extends EventEmitter implements Promise<T> {
    private readonly promise: Promise<T>
    readonly [Symbol.toStringTag]: "Promise"

    // Have the same constructor as a Promise
    constructor(executor: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: unknown) => void,
        emitter: PromiEvent<T, E>,
    ) => void) {
        // call the EventEmitter constructor
        super();

        this.promise = new Promise<T>((resolve, reject) => executor(resolve, reject, this));
    }

    /* Promise methods */

    // the same signature as Promise.then
    public then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): Promise<TResult1 | TResult2> {
        return this.promise.then(onFulfilled, onRejected);
    }

    // the same signature as Promise.catch
    public catch<TResult = never>(
        onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null,
    ): Promise<T | TResult> {
        return this.promise.catch(onRejected);
    }

    // the same signature as Promise.finally
    public finally(onFinally?: (() => void) | null | undefined): Promise<T> {
        return this.promise.finally(onFinally);
    }

    // used if you want to create a PromiEvent for a known value
    static resolve<T>(value: T): PromiEvent<T, never> {
        return new PromiEvent<T, never>((resolve) => {
            resolve(value);
        });
    }

    // used if you want to create a PromiEvent for a known failure
    static reject<T>(reason: unknown): PromiEvent<T, never> {
        return new PromiEvent<T, never>((resolve, reject) => {
            reject(reason);
        });
    }

    /* Strictly typed EventEmitter methods */

    addListener<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this {
        return super.addListener(event, listener as ((...args: unknown[]) => void));
    }

    on<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this {
        return super.on(event, listener as ((...args: unknown[]) => void));
    }

    once<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this {
        return super.once(event, listener as ((...args: unknown[]) => void));
    }

    removeListener<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this {
        return super.removeListener(event, listener as ((...args: unknown[]) => void));
    }

    off<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this {
        return super.off(event, listener as ((...args: unknown[]) => void));
    }

    removeAllListeners<K extends keyof E>(event: K extends string | symbol ? K : never): this {
        return super.removeAllListeners(event);
    }

    listeners<K extends keyof E>(event: K extends string | symbol ? K : never): ((...args: E[K]) => void)[] {
        return super.listeners(event) as ((...args: E[K]) => void)[];
    }

    rawListeners<K extends keyof E>(event: K extends string | symbol ? K : never): ((...args: E[K]) => void)[] {
        return super.rawListeners(event) as ((...args: E[K]) => void)[];
    }

    emit<K extends keyof E>(event: K extends string | symbol ? K : never, ...args: E[K]): boolean {
        return super.emit(event, ...args);
    }

    listenerCount<K extends keyof E>(event: K extends string | symbol ? K : never): number {
        return super.listenerCount(event);
    }

    prependListener<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this {
        return super.prependListener(event, listener as ((...args: unknown[]) => void));
    }

    prependOnceListener<K extends keyof E>(event: K extends string | symbol ? K : never, listener: (...args: E[K]) => void): this {
        return super.prependOnceListener(event, listener as ((...args: unknown[]) => void));
    }
}
