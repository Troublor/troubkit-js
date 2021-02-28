export * from "./reactive-structures";
export * from "./promievent";
export * from "./event-emitter";
export declare function sleep(ms: number): Promise<void>;
export declare function convenientTimeString(options?: {
    date?: boolean;
    moment?: boolean;
    millisecond?: boolean;
}): string;
export declare function removeItem<T>(array: T[], value: T): T[];
