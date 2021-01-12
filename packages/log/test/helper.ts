import * as stream from "stream";

export class LogAssertion extends stream.Writable {
    isAsserting = false;
    expectedValue: string | RegExp = "";
    resolve: (() => void | undefined) | undefined;

    constructor() {
        super();
        this.isAsserting = false;
    }

    _write(chunk: Buffer, encoding: BufferEncoding, callback: (error?: (Error | null)) => void): void {
        const str = chunk.toString("utf-8");
        if (this.isAsserting) {
            if (typeof this.expectedValue === "string") {
                expect(str.trim()).toEqual(this.expectedValue.trim());
            } else {
                expect(str).toMatch(this.expectedValue);
            }
            this.resolve && this.resolve();
            this.resolve = undefined;
        } else {
            console.log(str);
        }
        callback();
    }

    async expectLog(fn: () => void, expected: string | RegExp): Promise<void> {
        return new Promise<void>(resolve1 => {
            this.isAsserting = true;
            this.expectedValue = expected;
            this.resolve = resolve1;
            fn();
        });
    }

    async expectNoLog(fn: () => void): Promise<void> {
        return new Promise<void>(resolve1 => {
            this.isAsserting = true;
            this.expectedValue = "^expect no log$";
            this.resolve = resolve1;
            fn();
            setTimeout(() => {
                this.resolve && this.resolve();
                this.resolve = undefined;
            }, 100);
        });
    }
}
