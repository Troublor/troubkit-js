/*
This module defines helpers for uses of terminal, including execute commands in new terminal tab and so on.
 */
export class Command {
    // multiple cmds will be joined with &&
    private otherCmds: Command[];

    // payload stores the content of current command
    private readonly payload: string[];

    /**
     * Construct a new Command, with optional segments
     * @param segment
     * @param segments
     */
    constructor(segment: string, ...segments: string[]) {
        this.payload = [segment];
        for (const seg of segments) {
            const ss = seg.split(" ");
            for (const s of ss) {
                s.length > 0 ? this.payload.push(s) : undefined;
            }
        }
        this.otherCmds = [];
    }

    /**
     * Append more segments to the end of command
     * @param segments
     */
    public append(...segments: string[]): Command {
        for (const seg of segments) {
            const ss = seg.split(" ");
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
    public concat(...cmds: Command[]): Command {
        this.otherCmds.push(...cmds);
        return this;
    }

    /**
     * Shallow copy this command, otherCmds will only copy reference
     */
    public copy(): Command {
        const cmd = new Command(this.payload[0], ...this.payload.slice(1));
        cmd.otherCmds = [...this.otherCmds];
        return cmd;
    }

    public toString(): string {
        if (this.otherCmds.length <= 0) {
            return `${this.payload.join(" ")}`;
        } else {
            return `${this.payload.join(" ")} && ${this.otherCmds.map(cmd => cmd.toString()).join(" && ")}`;
        }
    }

    /**
     * get the child_process.spawn-like command
     */
    get command(): string {
        return this.payload[0];
    }

    /**
     * get the child_process.spawn-like args list
     */
    get args(): string[] {
        return this.payload.slice(1);
    }
}
