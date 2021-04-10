import { Command } from "./command";
export interface Tab {
    cmd: Command;
    cwd?: string | undefined;
    title?: string | undefined;
}
export declare class TerminalWindow {
    private app;
    private readonly tabs;
    constructor(app?: "iTerm" | "Terminal");
    addTab(cmd: Command, cwd?: string | undefined, title?: string | undefined): TerminalWindow;
    open(): void;
}
