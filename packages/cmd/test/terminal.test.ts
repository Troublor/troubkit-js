import {TerminalWindow} from "../src";
import {Command} from "../src";

describe("terminal", () => {
    test("should open tabs", () => {
        const terminal = new TerminalWindow();
        terminal
            .addTab(new Command("ls"))
            .addTab(new Command("ls -a"))
            .open();
    });
});
