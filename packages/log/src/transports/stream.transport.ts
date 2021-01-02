import {LogTransport} from "./tranport";
import * as stream from "stream";

export function StreamTransport(stream: stream.Writable): LogTransport {
    class streamTransport implements LogTransport {
        transport(): stream.Writable {
            return stream;
        }
    }

    return new streamTransport();
}
