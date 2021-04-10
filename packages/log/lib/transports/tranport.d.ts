/// <reference types="node" />
import * as stream from "stream";
export interface LogTransport {
    transport(): stream.Writable;
}
