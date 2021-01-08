import {TerminalWindow} from "../dist";
import {Command} from "../dist";

describe("terminal", () => {
    test("should open tabs", () => {
        const cmd = new Command("ls '-a'");
        new TerminalWindow("Terminal").addTab(cmd).addTab(new Command("echo \"abc\"")).open();
    });
});
