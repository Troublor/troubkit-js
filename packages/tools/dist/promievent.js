"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.PromiEvent = void 0;
const events_1 = require("events");

/**
 * The combination of Event Emitter and Promise.
 * Inspired by naddison36/promievent, but provide strict type specification support.
 * @see https://github.com/naddison36/promievent
 */
class PromiEvent extends events_1.EventEmitter {
    // Have the same constructor as a Promise
    constructor(executor) {
        // call the EventEmitter constructor
        super();
        this.promise = new Promise((resolve, reject) => executor(resolve, reject, this));
    }

    /* Promise methods */

    // the same signature as Promise.then
    then(onFulfilled, onRejected) {
        return this.promise.then(onFulfilled, onRejected);
    }

    // the same signature as Promise.catch
    catch(onRejected) {
        return this.promise.catch(onRejected);
    }

    // the same signature as Promise.finally
    finally(onFinally) {
        return this.promise.finally(onFinally);
    }

    // used if you want to create a PromiEvent for a known value
    static resolve(value) {
        return new PromiEvent((resolve) => {
            resolve(value);
        });
    }

    // used if you want to create a PromiEvent for a known failure
    static reject(reason) {
        return new PromiEvent((resolve, reject) => {
            reject(reason);
        });
    }

    /* Strictly typed EventEmitter methods */
    addListener(event, listener) {
        return super.addListener(event, listener);
    }

    on(event, listener) {
        return super.on(event, listener);
    }

    once(event, listener) {
        return super.once(event, listener);
    }

    removeListener(event, listener) {
        return super.removeListener(event, listener);
    }

    off(event, listener) {
        return super.off(event, listener);
    }

    removeAllListeners(event) {
        return super.removeAllListeners(event);
    }

    listeners(event) {
        return super.listeners(event);
    }

    rawListeners(event) {
        return super.rawListeners(event);
    }

    emit(event, ...args) {
        return super.emit(event, ...args);
    }

    listenerCount(event) {
        return super.listenerCount(event);
    }

    prependListener(event, listener) {
        return super.prependListener(event, listener);
    }

    prependOnceListener(event, listener) {
        return super.prependOnceListener(event, listener);
    }
}

exports.PromiEvent = PromiEvent;
//# sourceMappingURL=promievent.js.map
