export declare class Level {
    readonly levelStr: string;
    readonly levelNum: number;
    static ERROR: Level;
    static WARN: Level;
    static INFO: Level;
    static DEBUG: Level;
    static TRACE: Level;
    private constructor();
    toString(): string;
    get monoLenStr(): string;
    geq(otherLevel: Level): boolean;
    eq(otherLevel: Level): boolean;
}
