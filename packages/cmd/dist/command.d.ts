export declare class Command {
    private otherCmds;
    private readonly payload;
    /**
     * Construct a new Command, with optional segments
     * @param segments
     */
    constructor(...segments: string[]);
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
    get command(): string | undefined;
    /**
     * get the child_process.spawn-like args list
     */
    get args(): string[] | undefined;
}
