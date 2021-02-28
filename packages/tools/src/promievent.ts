import {EventEmitter, Events} from "./event-emitter";

export type Resolve<T> = (value: T | PromiseLike<T>) => void;
export type Reject = (reason?: unknown) => void;

/**
 * The combination of Event Emitter and Promise.
 * Inspired by naddison36/promievent, but provide strict type specification support.
 * @see https://github.com/naddison36/promievent
 */
export class PromiEvent<T, EV extends Events> extends EventEmitter<EV> implements Promise<T> {
    private readonly promise: Promise<T>
    readonly [Symbol.toStringTag]: "Promise"

    // Have the same constructor as a Promise
    constructor(executor: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: unknown) => void,
        emitter: PromiEvent<T, EV>,
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
    static reject<ER>(reason?: ER): PromiEvent<never, never> {
        return new PromiEvent<never, never>((resolve, reject) => {
            reject(reason);
        });
    }
}
