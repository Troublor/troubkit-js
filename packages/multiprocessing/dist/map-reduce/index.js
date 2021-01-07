"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true, get: function () {
            return m[k];
        }
    });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : {"default": mod};
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.map = void 0;
const cluster_1 = __importDefault(require("cluster"));
const path_1 = __importDefault(require("path"));
const tools_1 = require("@troubkit/tools");
const lodash_1 = __importDefault(require("lodash"));
const os = __importStar(require("os"));

async function map(dataList, mapperFile, numWorkers = os.cpus().length, errHandler) {
    if (dataList.length === 0) {
        return Promise.resolve(lodash_1.default.cloneDeep(dataList));
    }
    return new Promise((rs, rj) => {
        const exitPromises = [];
        let resolved = false;
        let rejected = false;
        const resolve = (payload) => {
            if (resolved || rejected) {
                return;
            }
            resolved = true;
            // tell all workers to exit
            for (const worker of [...freeWorkers, ...busyWorkers]) {
                worker.send({
                    isEnd: true,
                    data: null,
                    error: null,
                });
            }
            Promise.all(exitPromises).then(() => {
                rs(payload);
            });
        };
        const reject = (e) => {
            if (resolved || rejected) {
                return;
            }
            rejected = true;
            // tell all workers to exit
            for (const worker of [...freeWorkers, ...busyWorkers]) {
                worker.send({
                    isEnd: true,
                    data: null,
                    error: null,
                });
            }
            Promise.all(exitPromises).then(() => {
                rj(e);
            });
        };
        const freeWorkers = new tools_1.ReactiveList({
            onIn: worker => {
                // no more data, tell worker to exit
                if (workDataList.length() === 0) {
                    return;
                }
                // dispatch next data
                const data = workDataList.shift();
                busyWorkers.push(worker);
                if (worker.isDead()) {
                    return;
                }
                worker.send({
                    isEnd: false,
                    data: data,
                    error: null,
                });
            },
        });
        const busyWorkers = new tools_1.ReactiveList();
        const workDataList = new tools_1.ReactiveList({
            onIn: value => {
                const worker = freeWorkers.shift();
                if (!worker) {
                    return true;
                }
                // dispatch next data
                busyWorkers.push(worker);
                if (worker.isDead()) {
                    return true;
                }
                worker.send({
                    isEnd: false,
                    data: value,
                    error: null,
                });
                return false;
            },
        });
        const mappedDataList = new tools_1.ReactiveList();
        const checkFinish = () => {
            // check if there is worker running
            if (mappedDataList.length() === dataList.length) {
                resolve(mappedDataList.toArray());
            }
        };
        cluster_1.default.setupMaster({
            exec: path_1.default.join(__dirname, "map-worker"),
            args: [mapperFile],
            silent: false,
        });
        for (let i = 0; i < numWorkers; i++) {
            const worker = cluster_1.default.fork();
            exitPromises.push(new Promise(r => {
                worker.on("exit", () => {
                    r();
                });
            }));
            // collect data
            worker.on("message", (msg) => {
                if (msg.error) {
                    // console.log(worker.process.pid, "error", msg.data);
                    if (msg.data) {
                        // push the data back to dataList
                        workDataList.push(msg.data);
                    }
                    if (errHandler) {
                        // recover if errCallback is provided
                        errHandler(new Error(msg.error));
                    } else {
                        reject(new Error(msg.error));
                        return;
                    }
                } else if (!msg.isEnd) {
                    // console.log(worker.process.pid, "mapped", msg.data);
                    mappedDataList.push(msg.data);
                    checkFinish();
                }
                busyWorkers.remove(worker);
                if (!msg.isEnd) {
                    freeWorkers.push(worker);
                }
            });
            freeWorkers.push(worker);
        }
        // feed data
        for (const data of dataList) {
            workDataList.push(data);
        }
    });
}

exports.map = map;
// export async function reduce<D extends Serializable, R extends Serializable>(dataList: D[], initialValue: R, reducerFile: string): Promise<R[]> {
//
// }
//# sourceMappingURL=index.js.map
