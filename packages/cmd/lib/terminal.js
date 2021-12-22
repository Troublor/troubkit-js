"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalWindow = void 0;
const os_1 = __importDefault(require("os"));
const command_1 = require("./command");
const child_process = __importStar(require("child_process"));
class TerminalWindow {
    constructor(app = "Terminal") {
        this.app = app;
        this.tabs = [];
    }
    addTab(cmd, cwd = undefined, title = undefined) {
        this.tabs.push({
            cmd: cmd,
            cwd: cwd,
            title: title,
        });
        return this;
    }
    // open the terminal window
    open() {
        const osType = os_1.default.type();
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
                    throw new Error(r.stderr.toString());
                }
                first = false;
            }
        }
        else if (osType === "Linux") {
            // Linux // TODO currently only support ubuntu
            let first = true;
            const gnomeCmd = new command_1.Command("gnome-terminal");
            for (const tab of this.tabs) {
                if (first) {
                    gnomeCmd.append("--window");
                    first = false;
                }
                else {
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
        }
        else {
            console.error(`Cannot open terminal in system: ${osType}`);
        }
    }
}
exports.TerminalWindow = TerminalWindow;
//# sourceMappingURL=terminal.js.map