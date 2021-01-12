export class Level {
    public static ERROR = new Level("ERROR", 1);
    public static WARN = new Level("WARN", 2);
    public static INFO = new Level("INFO", 3);
    public static DEBUG = new Level("DEBUG", 4);
    public static TRACE = new Level("TRACE", 5);

    private constructor(
        public readonly levelStr: string,
        public readonly levelNum: number,
    ) {
    }

    public toString(): string {
        return this.levelStr;
    }

    public get monoLenStr(): string {
        return this.levelStr.padEnd(5, " ");
    }

    public geq(otherLevel: Level): boolean {
        return this.levelNum >= otherLevel.levelNum;
    }

    public eq(otherLevel: Level): boolean {
        return this.levelNum === otherLevel.levelNum;
    }
}
