import { Format } from "logform";
interface StructuredLogOptions {
    colorize?: boolean;
}
export declare const defaultStructuredLogOptions: StructuredLogOptions;
export declare function structured(opt?: StructuredLogOptions): Format;
export {};
