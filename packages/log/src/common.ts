import {Level} from "./levels";
import {ArgType} from "./styles";

export interface LogEvent<T extends ArgType> {
    moduleName: string,
    level: Level,
    message: string,
    args: T,
    time: Date;
    pid: number;
}

export type Stringifiable = Record<string, unknown> | string | boolean | number;

export type Printable = Stringifiable | null | undefined;

export function PrintableToString(payload: Printable): string {
    let contextValue: string;
    if (payload === undefined) {
        contextValue = "undefined";
    } else if (payload === null) {
        contextValue = "null";
    } else if (typeof payload === "string") {
        contextValue = payload as string;
    } else if (Object.prototype.hasOwnProperty.call(payload, "toLocalString")) {
        contextValue = (payload as Stringifiable).toLocaleString();
    } else if (Object.prototype.hasOwnProperty.call(payload, "toString")) {
        contextValue = (payload as Stringifiable).toLocaleString();
    } else {
        contextValue = payload as unknown as string;
    }
    return contextValue;
}
