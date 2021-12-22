/// <reference types="node" />
import {EventEmitter as Emitter} from "events";

export interface Events {
    [eventName: string | symbol]: unknown[];
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
export declare class EventEmitter<EV extends Events> extends Emitter {
    constructor(executor?: (emitter: EventEmitter<EV>) => void);
    addListener<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this;
    on<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this;
    once<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this;
    removeListener<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this;
    off<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this;
    removeAllListeners<K extends keyof EV>(event: K extends string | symbol ? K : never): this;
    listeners<K extends keyof EV>(event: K extends string | symbol ? K : never): ((...args: EV[K]) => void)[];
    rawListeners<K extends keyof EV>(event: K extends string | symbol ? K : never): ((...args: EV[K]) => void)[];
    emit<K extends keyof EV>(event: K extends string | symbol ? K : never, ...args: EV[K]): boolean;
    listenerCount<K extends keyof EV>(event: K extends string | symbol ? K : never): number;
    prependListener<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this;
    prependOnceListener<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this;
}
