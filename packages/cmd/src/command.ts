/*
This module defines helpers for uses of terminal, including execute commands in new terminal tab and so on.
 */
export interface Segment {
    rawStr: string,
    parsedStr: string;
}

export class Command {
    // multiple cmds will be joined with &&
    private otherCmds: Command[];

    // payload stores the content of current command
    private readonly payload: Segment[];

    public static split(str: string): Segment[] {
        const parseCache = (raw: string[], parsed: string[]): Segment => {
            return {
                rawStr: raw.join(""),
                parsedStr: parsed.join(""),
            };
        };
        const secs = [];
        let inString: false | "\"" | "'" = false;
        let transformed = false;
        let rawCache = [];
        let parsedCache = [];
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            if (char === "\\" && !transformed) {
                rawCache.push(char);
                transformed = true;
            } else {
                if (inString) {
                    rawCache.push(char);
                    if (char === inString && !transformed) {
                        inString = false;
                    } else {
                        parsedCache.push(char);
                    }
                } else if (char === " ") {
                    if (rawCache.length > 0) {
                        secs.push(parseCache(rawCache, parsedCache));
                        rawCache = [];
                        parsedCache = [];
                    }
                } else if ((char === "\"" || char === "'") && !transformed) {
                    rawCache.push(char);
                    inString = char;
                } else {
                    rawCache.push(char);
                    parsedCache.push(char);
                }
                transformed = false;
            }
        }
        if (rawCache.length > 0) {
            secs.push(parseCache(rawCache, parsedCache));
        }
        return secs;
    }

    /**
     * Construct a new Command, with optional segments
     * @param segment
     * @param segments
     */
    constructor(segment: string, ...segments: string[]) {
        segments.unshift(segment);
        this.payload = [];
        for (const seg of segments) {
            const ss = Command.split(seg);
            for (const s of ss) {
                s.rawStr.length > 0 ? this.payload.push(s) : undefined;
            }
        }
        if (this.payload.length === 0) {
            throw new Error("command must not be empty");
        }
        this.otherCmds = [];
    }

    /**
     * Append more segments to the end of command
     * @param segments
     */
    public append(...segments: string[]): Command {
        for (const seg of segments) {
            const ss = Command.split(seg);
            for (const s of ss) {
                s.rawStr.length > 0 ? this.payload.push(s) : undefined;
            }
        }
        return this;
    }

    /**
     * Concat other commands to this command. e.g. cd /var && ls -a
     * @param cmds
     */
    public concat(...cmds: Command[]): Command {
        this.otherCmds.push(...cmds);
        return this;
    }

    /**
     * Shallow copy this command, otherCmds will only copy reference
     */
    public copy(): Command {
        const cmd = new Command(this.payload[0].rawStr, ...this.payload.slice(1).map(value => value.rawStr));
        cmd.otherCmds = this.otherCmds.map(value => value.copy());
        return cmd;
    }

    public toString(): string {
        if (this.otherCmds.length <= 0) {
            return `${this.payload.map(value => value.rawStr).join(" ")}`;
        } else {
            return `${this.payload.map(value => value.rawStr).join(" ")} && ${this.otherCmds.map(cmd => cmd.toString()).join(" && ")}`;
        }
    }

    public toEscapedString(): string {
        return this.toString().replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
    }

    /**
     * get the child_process.spawn-like command
     */
    get command(): string {
        return this.payload[0].parsedStr;
    }

    /**
     * get the child_process.spawn-like args list
     */
    get args(): string[] {
        return this.payload.slice(1).map(value => value.parsedStr);
    }
}
