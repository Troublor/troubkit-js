import os from "os";
import {Command} from "./command";
import * as child_process from "child_process";

export interface Tab {
    // the command to be executed in this tab
    cmd: Command;
    // working directory of this tab
    cwd?: string | undefined;
    // tab title
    title?: string | undefined;
}

export class TerminalWindow {
    private readonly tabs: Tab[];

    constructor(
        private app: "iTerm" | "Terminal" = "Terminal",
    ) {
        this.tabs = [];
    }

    public addTab(cmd: Command, cwd: string | undefined = undefined, title: string | undefined = undefined): TerminalWindow {
        this.tabs.push({
            cmd: cmd,
            cwd: cwd,
            title: title,
        });
        return this;
    }

    // open the terminal window
    public open(): void {
        const osType = os.type();
        if (osType === "Darwin") {
            // MacOS
            let first = true;
            // only open the first tab in new window
            for (const tab of this.tabs) {
                const r = child_process.spawnSync("osascript", [
                    "-e", `tell application "${this.app}" to activate`,
                    "-e", `tell application "System Events" to tell process "${this.app}" to keystroke "${first ? "n" : "t"}" using {command down}`,
                    "-e", `tell application "${this.app}" to do script "${tab.cmd.toEscapedString()}" in selected tab of the front window`,
                ]);
                if (r.error) {
                    throw r.error;
                }
                if (r.status !== 0) {
                    throw new Error(r.stderr);
                }
                first = false;
            }
        } else if (osType === "Linux") {
            // Linux // TODO currently only support ubuntu
            let first = true;
            const gnomeCmd = new Command("gnome-terminal");
            for (const tab of this.tabs) {
                if (first) {
                    gnomeCmd.append("--window");
                    first = false;
                } else {
                    gnomeCmd.append("--tab");
                }
                if (tab.title) {
                    gnomeCmd.append(`--title="${tab.title}"`);
                }
                if (tab.cwd) {
                    gnomeCmd.append(`--working-directory="${tab.cwd}"`);
                }
                gnomeCmd.append(`--command="${tab.cmd.toString()}"`);
            }
            child_process.spawnSync(gnomeCmd.command, gnomeCmd.args);
        } else {
            console.error(`Cannot open terminal in system: ${osType}`);
        }
    }
}
