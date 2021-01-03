import {TerminalWindow} from "../src";
import {Command} from "../src";

describe("terminal", () => {
    test("should open tabs", () => {
        const cmd = new Command("ls '-a'");
        new TerminalWindow("Terminal").addTab(cmd).addTab(new Command("echo \"abc\"")).open();
    });
});
