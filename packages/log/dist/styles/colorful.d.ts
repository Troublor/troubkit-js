import { Level } from "../levels";
export declare abstract class Colorful {
    colorful: boolean;
    constructor(colorful?: boolean);
    protected paintColor(level: Level, str: string): string;
}
