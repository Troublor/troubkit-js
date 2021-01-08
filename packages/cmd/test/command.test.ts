import {Command} from "../dist";
import {Segment} from "../dist";

function genSegment(raw: string, parsed?: string): Segment {
    return {
        rawStr: raw,
        parsedStr: parsed ? parsed : raw,
    };
}

describe("Command split", () => {
    test("should handle basic string", () => {
        const segments = Command.split("ls a  b");
        expect(segments).toEqual([genSegment("ls"), genSegment("a"), genSegment("b")]);
    });

    test("should handle inner string", () => {
        let segments = Command.split("ls 'a  \"b c\"'");
        expect(segments).toEqual([genSegment("ls"), genSegment("'a  \"b c\"'", "a  \"b c\"")]);

        segments = Command.split("ls \"a  b c\"");
        expect(segments).toEqual([genSegment("ls"), genSegment("\"a  b c\"", "a  b c")]);
    });
});

describe("Command", () => {
    test("should not be empty", () => {
        expect(() => new Command("")).toThrow("empty");
        expect(() => new Command(" ")).toThrow("empty");
        expect(() => new Command(" a")).not.toThrow("empty");
    });

    test("should copy itself", () => {
        const cmd = new Command("cmd a b ");
        const cp = cmd.copy();
        cmd.append("c");
        expect(cp.toString()).toEqual("cmd a b");
        expect(cp.command).toEqual("cmd");
        expect(cp.args).toEqual(["a", "b"]);
    });

    test("should copy other cmds", () => {
        const cmd1 = new Command("cmd1");
        const cmd2 = new Command("cmd2");
        cmd1.concat(cmd2);
        const cp = cmd1.copy();
        cmd2.append("a");
        expect(cp.toString()).toEqual("cmd1 && cmd2");
    });

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

    test("should generate equivalent string", () => {
        const cmd = new Command("cmd 'a b'")
            .append("\" c d\"");
        expect(cmd.toString()).toEqual("cmd 'a b' \" c d\"");
    });

    test("should escape string", () => {
        const cmd = new Command("cmd \"a\"");
        expect(cmd.toEscapedString()).toEqual("cmd \\\"a\\\"");
    });

    test("should handle transformed chars", () => {
        const cmd = new Command("cmd '\\'ab\"a\"' ");
        expect(cmd.toString()).toEqual("cmd '\\'ab\"a\"'");
        expect(cmd.command).toEqual("cmd");
        expect(cmd.args).toEqual(["'ab\"a\""]);
    });

    test("should handle corner case0", () => {
        const cmd = new Command("c\"m\"d -a");
        expect(cmd.toString()).toEqual("c\"m\"d -a");
        expect(cmd.command).toEqual("cmd");
        expect(cmd.args).toEqual(["-a"]);
    });

    test("should handle corner case1", () => {
        const cmd = new Command("cmd \"a\"b'c'");
        expect(cmd.toString()).toEqual("cmd \"a\"b'c'");
        expect(cmd.command).toEqual("cmd");
        expect(cmd.args).toEqual(["abc"]);
    });

    test("should handle corner case2", () => {
        const cmd = new Command("cmd \"a \"b' c'");
        expect(cmd.toString()).toEqual("cmd \"a \"b' c'");
        expect(cmd.command).toEqual("cmd");
        expect(cmd.args).toEqual(["a b c"]);
    });

    test("should handle corner case3", () => {
        const cmd = new Command("cmd \\\"a");
        expect(cmd.toString()).toEqual("cmd \\\"a");
        expect(cmd.command).toEqual("cmd");
        expect(cmd.args).toEqual(["\"a"]);
    });

    test("should handle corner case4", () => {
        const cmd = new Command("cmd \\'a\\'");
        expect(cmd.toString()).toEqual("cmd \\'a\\'");
        expect(cmd.command).toEqual("cmd");
        expect(cmd.args).toEqual(["'a'"]);
    });
});
