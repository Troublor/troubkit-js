export interface Segment {
    rawStr: string;
    parsedStr: string;
}
export declare class Command {
    private otherCmds;
    private readonly payload;
    static split(str: string): Segment[];
    /**
     * Construct a new Command, with optional segments
     * @param segment
     * @param segments
     */
    constructor(segment: string, ...segments: string[]);
    /**
     * Append more segments to the end of command
     * @param segments
     */
    append(...segments: string[]): Command;
    /**
     * Concat other commands to this command. e.g. cd /var && ls -a
     * @param cmds
     */
    concat(...cmds: Command[]): Command;
    /**
     * Shallow copy this command, otherCmds will only copy reference
     */
    copy(): Command;
    toString(): string;
    /**
     * get the child_process.spawn-like command
     */
    get command(): string;
    /**
     * get the child_process.spawn-like args list
     */
    get args(): string[];
}
