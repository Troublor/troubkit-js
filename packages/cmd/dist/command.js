"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
/*
This module defines helpers for uses of terminal, including execute commands in new terminal tab and so on.
 */
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
                s.length > 0 ? this.payload.push(s) : undefined;
            }
        }
        if (this.payload.length === 0) {
            throw new Error("command must not be empty");
        }
        this.otherCmds = [];
    }
    static split(str) {
        const secs = [];
        let inString = false;
        let cache = [];
        for (let i = 0; i < str.length; i++) {
            const char = str.charAt(i);
            if (inString) {
                if (char === inString) {
                    inString = false;
                }
                else {
                    cache.push(char);
                }
            }
            else if (char === " ") {
                if (cache.length > 0) {
                    secs.push(cache.join(""));
                    cache = [];
                }
            }
            else if (char === "\"" || char === "'") {
                inString = char;
            }
            else {
                cache.push(char);
            }
        }
        if (cache.length > 0) {
            secs.push(cache.join(""));
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
                s.length > 0 ? this.payload.push(s) : undefined;
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
        const cmd = new Command(this.payload[0], ...this.payload.slice(1));
        cmd.otherCmds = [...this.otherCmds];
        return cmd;
    }
    toString() {
        if (this.otherCmds.length <= 0) {
            return `${this.payload.join(" ")}`;
        }
        else {
            return `${this.payload.join(" ")} && ${this.otherCmds.map(cmd => cmd.toString()).join(" && ")}`;
        }
    }
    /**
     * get the child_process.spawn-like command
     */
    get command() {
        return this.payload[0];
    }
    /**
     * get the child_process.spawn-like args list
     */
    get args() {
        return this.payload.slice(1);
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map