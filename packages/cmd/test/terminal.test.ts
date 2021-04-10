import {TerminalWindow} from "../lib";
import {Command} from "../lib";

describe("terminal", () => {
    test("should open tabs", () => {
        const cmd = new Command("ls '-a'");
        new TerminalWindow("Terminal").addTab(cmd).addTab(new Command("echo \"abc\"")).open();
    });
});
