import {LogTransport} from "./tranport";
import * as Stream from "stream";

class stdoutTransport implements LogTransport {
    transport(): Stream.Writable {
        return process.stdout;
    }
}

export const StdoutTransport = (): LogTransport => new stdoutTransport();
