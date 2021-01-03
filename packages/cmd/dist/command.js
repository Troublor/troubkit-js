"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    /**
     * Construct a new Command, with optional segments
     * @param segment
     * @param segments
     */
    constructor(segment, ...segments) {
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
    static split(str) {
        const parseCache = (raw, parsed) => {
            return {
                rawStr: raw.join(""),
                parsedStr: parsed.join(""),
            };
        };
        const secs = [];
        let inString = false;
        let transformed = false;
        let rawCache = [];
        let parsedCache = [];
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            if (char === "\\" && !transformed) {
                rawCache.push(char);
                transformed = true;
            }
            else {
                if (inString) {
                    rawCache.push(char);
                    if (char === inString && !transformed) {
                        inString = false;
                    }
                    else {
                        parsedCache.push(char);
                    }
                }
                else if (char === " ") {
                    if (rawCache.length > 0) {
                        secs.push(parseCache(rawCache, parsedCache));
                        rawCache = [];
                        parsedCache = [];
                    }
                }
                else if ((char === "\"" || char === "'") && !transformed) {
                    rawCache.push(char);
                    inString = char;
                }
                else {
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
     * Append more segments to the end of command
     * @param segments
     */
    append(...segments) {
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
    concat(...cmds) {
        this.otherCmds.push(...cmds);
        return this;
    }
    /**
     * Shallow copy this command, otherCmds will only copy reference
     */
    copy() {
        const cmd = new Command(this.payload[0].rawStr, ...this.payload.slice(1).map(value => value.rawStr));
        cmd.otherCmds = this.otherCmds.map(value => value.copy());
        return cmd;
    }
    toString() {
        if (this.otherCmds.length <= 0) {
            return `${this.payload.map(value => value.rawStr).join(" ")}`;
        }
        else {
            return `${this.payload.map(value => value.rawStr).join(" ")} && ${this.otherCmds.map(cmd => cmd.toString()).join(" && ")}`;
        }
    }
    /**
     * get the child_process.spawn-like command
     */
    get command() {
        return this.payload[0].parsedStr;
    }
    /**
     * get the child_process.spawn-like args list
     */
    get args() {
        return this.payload.slice(1).map(value => value.parsedStr);
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map