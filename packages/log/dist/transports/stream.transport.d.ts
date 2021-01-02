/// <reference types="node" />
import { LogTransport } from "./tranport";
import * as stream from "stream";
export declare function StreamTransport(stream: stream.Writable): LogTransport;
