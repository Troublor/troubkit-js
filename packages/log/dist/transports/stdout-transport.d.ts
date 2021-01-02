/// <reference types="node" />
import { LogTransport } from "./tranport";
declare class stdoutTransport implements LogTransport {
    transport(): NodeJS.WriteStream;
}
export declare const StdoutTransport: stdoutTransport;
export {};
