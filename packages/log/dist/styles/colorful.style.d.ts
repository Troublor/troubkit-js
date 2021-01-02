import { Level } from "../levels";
export declare abstract class ColorfulStyle {
    colorful: boolean;
    protected paintColor(level: Level, str: string): string;
}
