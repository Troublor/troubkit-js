import {EventEmitter, Events} from "./event-emitter";
export declare type Resolve<T> = (value: T | PromiseLike<T>) => void;
export declare type Reject = (reason?: unknown) => void;

/**
 * The combination of Event Emitter and Promise.
 * Inspired by naddison36/promievent, but provide strict type specification support.
 * @see https://github.com/naddison36/promievent
 */
export declare class PromiEvent<T, EV extends Events> extends EventEmitter<EV> implements Promise<T> {
    private readonly promise;
    readonly [Symbol.toStringTag]: "Promise";

    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void, emitter: PromiEvent<T, EV>) => void);

    then<TResult1 = T, TResult2 = never>(onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;

    catch<TResult = never>(onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;

    finally(onFinally?: (() => void) | null | undefined): Promise<T>;

    static resolve<T>(value: T): PromiEvent<T, never>;

    static reject<ER>(reason?: ER): PromiEvent<never, never>;
}
