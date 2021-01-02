import {TerminalWindow} from "../src";
import {Command} from "../src";

describe("terminal", () => {
    test("should open tabs", () => {
        const cmd = new Command("mkdir \"a ba c\"");
        new TerminalWindow("Terminal").addTab(cmd).addTab(new Command("ls -a")).open();
    });
});
