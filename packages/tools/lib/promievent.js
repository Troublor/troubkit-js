"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiEvent = void 0;
const event_emitter_1 = require("./event-emitter");
/**
 * The combination of Event Emitter and Promise.
 * Inspired by naddison36/promievent, but provide strict type specification support.
 * @see https://github.com/naddison36/promievent
 */
class PromiEvent extends event_emitter_1.EventEmitter {
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
}
exports.PromiEvent = PromiEvent;
//# sourceMappingURL=promievent.js.map