import {Command} from "../src";

describe("Command split", () => {
    test("should handle basic string", () => {
        const segments = Command.split("ls a  b");
        expect(segments).toEqual(["ls", "a", "b"]);
    });

    test("should handle inner string", () => {
        let segments = Command.split("ls 'a  \"b c\"'");
        expect(segments).toEqual(["ls", "a  \"b c\""]);

        segments = Command.split("ls \"a  b c\"");
        expect(segments).toEqual(["ls", "a  b c"]);
    });
});

describe("Command", () => {
    test("should split command arguments", () => {
        const cmd = new Command("cmd a b c");
        expect(cmd.command).toEqual("cmd");
        expect(cmd.args).toEqual(["a", "b", "c"]);
    });

    test("should be able to append", () => {
        const cmd = new Command("cmd a ");
        cmd.append(" b c");
        cmd.append("d");
        expect(cmd.command).toEqual("cmd");
        expect(cmd.args).toEqual(["a", "b", "c", "d"]);
    });

    test("should generate string correctly", () => {
        const cmd = new Command(" cmd a b");
        cmd.append("c d");
        expect(cmd.toString()).toEqual("cmd a b c d");
    });

    test("should be able to concat another command", () => {
        const cmd1 = new Command("cmd1 a b");
        const cmd2 = new Command("cmd2");
        cmd2.append("--opt a");
        const cmd = cmd1.concat(cmd2);
        expect(cmd.toString()).toEqual("cmd1 a b && cmd2 --opt a");
    });

    test("should be able to handle string", () => {
        const cmd = new Command("cmd 'a b'")
            .append("\" c d\"");
        expect(cmd.args).toEqual(["a b", " c d"]);
    });
});
