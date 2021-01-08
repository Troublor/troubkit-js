import {Serializable} from "child_process";
import cluster from "cluster";
import path from "path";
import {TransportData} from "./ipc";
import {ReactiveList} from "@troubkit/tools";
import _ from "lodash";
import * as os from "os";

export async function map<D extends Serializable, M extends Serializable>(
    dataList: D[],
    mapperFile: string,
    numWorkers: number = os.cpus().length,
    errHandler?: (e: Error) => void): Promise<M[]> {
    if (dataList.length === 0) {
        return Promise.resolve(_.cloneDeep(dataList) as unknown as M[]);
    }
    return new Promise<M[]>((rs, rj) => {
        const exitPromises: Promise<void>[] = [];
        const exitAllWorkers = () => {
            // tell all workers to exit
            for (const worker of [...freeWorkers, ...busyWorkers]) {
                try {
                    worker.send({
                        isEnd: true,
                        data: null,
                        error: null,
                    } as TransportData<D>);
                } catch (e) {
                    if (e.message !== "write EPIPE") { // only if the worker has not exit
                        throw e;
                    }
                }
            }
        };

        let resolved = false;
        let rejected = false;
        const resolve = (payload: M[]) => {
            if (resolved || rejected) {
                return;
            }
            resolved = true;

            exitAllWorkers();

            Promise.all(exitPromises).then(() => {
                rs(payload);
            });
        };
        const reject = (e: Error) => {
            if (resolved || rejected) {
                return;
            }
            rejected = true;

            exitAllWorkers();

            Promise.all(exitPromises).then(() => {
                rj(e);
            });
        };
        const freeWorkers: ReactiveList<cluster.Worker> = new ReactiveList<cluster.Worker>({
            beforeIn: worker => {
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
                } as TransportData<D>);
            },
        });
        const busyWorkers: ReactiveList<cluster.Worker> = new ReactiveList<cluster.Worker>();
        const workDataList: ReactiveList<D> = new ReactiveList<D>({
            beforeIn: value => {
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
                } as TransportData<D>);
                return false;
            },
        });
        const mappedDataList: ReactiveList<M> = new ReactiveList<M>();
        const checkFinish = (): void => {
            // check if there is worker running
            if (mappedDataList.length() === dataList.length) {
                resolve(mappedDataList.toArray());
            }
        };

        cluster.setupMaster({
            exec: path.join(__dirname, "map-worker"),
            args: [mapperFile],
            silent: false,
        });


        for (let i = 0; i < numWorkers; i++) {
            const worker = cluster.fork();
            exitPromises.push(new Promise<void>(r => {
                worker.on("exit", () => {
                    r();
                });
            }));

            // collect data
            worker.on("message", (msg: TransportData<M>) => {
                if (msg.error) {
                    // console.log(worker.process.pid, "error", msg.data);
                    if (msg.data) {
                        // push the data back to dataList
                        workDataList.push(msg.data as unknown as D);
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
                    mappedDataList.push(msg.data as M);
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

// export async function reduce<D extends Serializable, R extends Serializable>(dataList: D[], initialValue: R, reducerFile: string): Promise<R[]> {
//
// }


