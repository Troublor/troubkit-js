import {LogTransport} from "./tranport";
import * as fs from "fs";
import * as Stream from "stream";

export function FileTransport(path: string): LogTransport {
    class fileTransport implements LogTransport {
        transport(): Stream.Writable {
            return fs.createWriteStream(path, {encoding: "utf-8"});
        }
    }

    return new fileTransport();
}

