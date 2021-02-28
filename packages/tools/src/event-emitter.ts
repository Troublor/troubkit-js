import {EventEmitter as Emitter} from "events";

export interface Events {
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
export class EventEmitter<EV extends Events> extends Emitter {
    // Have the same constructor as a Promise
    constructor(executor?: (
        emitter: EventEmitter<EV>,
    ) => void) {
        // call the EventEmitter constructor
        super();
        executor && executor(this);
    }

    /* Strictly typed EventEmitter methods */

    addListener<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this {
        return super.addListener(event, listener as ((...args: unknown[]) => void));
    }

    on<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this {
        return super.on(event, listener as ((...args: unknown[]) => void));
    }

    once<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this {
        return super.once(event, listener as ((...args: unknown[]) => void));
    }

    removeListener<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this {
        return super.removeListener(event, listener as ((...args: unknown[]) => void));
    }

    off<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this {
        return super.off(event, listener as ((...args: unknown[]) => void));
    }

    removeAllListeners<K extends keyof EV>(event: K extends string | symbol ? K : never): this {
        return super.removeAllListeners(event);
    }

    listeners<K extends keyof EV>(event: K extends string | symbol ? K : never): ((...args: EV[K]) => void)[] {
        return super.listeners(event) as ((...args: EV[K]) => void)[];
    }

    rawListeners<K extends keyof EV>(event: K extends string | symbol ? K : never): ((...args: EV[K]) => void)[] {
        return super.rawListeners(event) as ((...args: EV[K]) => void)[];
    }

    emit<K extends keyof EV>(event: K extends string | symbol ? K : never, ...args: EV[K]): boolean {
        return super.emit(event, ...args);
    }

    listenerCount<K extends keyof EV>(event: K extends string | symbol ? K : never): number {
        return super.listenerCount(event);
    }

    prependListener<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this {
        return super.prependListener(event, listener as ((...args: unknown[]) => void));
    }

    prependOnceListener<K extends keyof EV>(event: K extends string | symbol ? K : never, listener: (...args: EV[K]) => void): this {
        return super.prependOnceListener(event, listener as ((...args: unknown[]) => void));
    }
}
