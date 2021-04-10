import { Level } from "./levels";
import { ArgType } from "./styles";
export interface LogEvent<T extends ArgType> {
    moduleName: string;
    level: Level;
    message: string;
    args: T;
    time: Date;
    pid: number;
}
export declare type Stringifiable = Record<string, unknown> | string | boolean | number;
export declare type Printable = Stringifiable | null | undefined;
export declare function PrintableToString(payload: Printable): string;
