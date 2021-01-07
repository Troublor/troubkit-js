/// <reference types="node" />
import {Serializable} from "child_process";
export declare function map<D extends Serializable, M extends Serializable>(dataList: D[], mapperFile: string, numWorkers?: number, errHandler?: (e: Error) => void): Promise<M[]>;
