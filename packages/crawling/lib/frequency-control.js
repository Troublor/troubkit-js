"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrequencyControlledTaskManager = void 0;
const tools_1 = require("@troubkit/tools");
/**
 * A task manager which schedule tasks to be executed in a specified frequency.
 * This is typical useful when invoking some APIs that have a rate limit.
 */
class FrequencyControlledTaskManager extends tools_1.EventEmitter {
  /**
   * @param controlledPeriod the period in milliseconds that the parallelled capacity is applied.
   * @param parallelCapacity the number of tasks that can be run in parallel per controlled period.
   */
  constructor(controlledPeriod, parallelCapacity) {
    super();
    this.controlledPeriod = controlledPeriod;
    this.parallelCapacity = parallelCapacity;
    this.pendingTasks = [];
    this.interval = undefined;
  }

  /**
   * Start the task manager, which will execute task within control period and parallel capacity.
   * Tasks can be added via `addTask` method.
   */
  start() {
    const period = () => {
      for (let i = 0; i < this.parallelCapacity; i++) {
        if (this.pendingTasks.length <= 0) {
          return;
        }
        const task = this.pendingTasks.shift();
        if (!task) {
          continue;
        }
        this.wrapAsPromise(task.execute).then((r) => {
          task.callback && task.callback(undefined, r);
        }).catch(err => {
          task.callback && task.callback(err, undefined);
        }).finally(() => {
          if (this.pendingTasks.length <= 0) {
            this.emit("queueEmpty");
          }
        });
      }
    };
    period();
    this.interval = setInterval(period, this.controlledPeriod);
  }

  /**
   * Stop processing more tasks.
   * Note that tasks added when the manager is stopped will be stored inside manager
   * and will be executed when manager is started again.
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * Implementation of addTask.
   *
   * @param args
   */
  addTask(...args) {
    if (args.length < 1) {
      throw new Error("insufficient arguments");
    }
    const arg0 = args[0];
    let task = {};
    if (typeof arg0 === "function") {
      task.execute = arg0;
      task.callback = args.length >= 2 && typeof args[1] === "function" ?
        args[1] : undefined;
      if (task.callback) {
        this.pendingTasks.push(task);
        this.emit("newTask", task);
        return;
      } else {
        return new Promise(((resolve, reject) => {
          task.callback = (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          };
          this.pendingTasks.push(task);
          this.emit("newTask", task);
        }));
      }
    } else if (typeof arg0 === "object" &&
      arg0 !== null &&
      typeof arg0["execute"] === "function") {
      task = arg0;
      this.pendingTasks.push(task);
      this.emit("newTask", task);
      return;
    } else {
      throw new Error("invalid arguments");
    }
  }

  wrapAsPromise(fn) {
    return new Promise((resolve, reject) => {
      try {
        const ret = fn();
        if (ret instanceof Promise) {
          ret.then(resolve).catch(reject);
        } else {
          resolve(ret);
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
exports.FrequencyControlledTaskManager = FrequencyControlledTaskManager;
//# sourceMappingURL=frequency-control.js.map
