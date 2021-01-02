import chalk from "chalk";
import {Level} from "../levels";

export abstract class Colorful {
    constructor(
        public colorful: boolean = false,
    ) {
    }

    protected paintColor(level: Level, str: string): string {
        if (this.colorful) {
            if (level.eq(Level.TRACE)) {
                return chalk.blue(str);
            } else if (level.eq(Level.DEBUG)) {
                return chalk.cyan(str);
            } else if (level.eq(Level.INFO)) {
                return chalk.green(str);
            } else if (level.eq(Level.WARN)) {
                return chalk.yellow(str);
            } else if (level.eq(Level.ERROR)) {
                return chalk.red(str);
            } else if (level.eq(Level.FATAL)) {
                return chalk.magenta(str);
            } else {
                return str;
            }
        } else {
            return str;
        }
    }
}
