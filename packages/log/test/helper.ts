import * as stream from "stream";

export class LogAssertion extends stream.Writable {
    isAsserting: boolean = false;
    expectedValue: string | RegExp = "";
    resolve: Function | undefined;

    constructor() {
        super();
        this.isAsserting = false;
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: (Error | null)) => void) {
        const str = Buffer.from(chunk, encoding).toString();
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

    async expectLog(fn: () => void, expected: string | RegExp) {
        return new Promise<void>(resolve1 => {
            this.isAsserting = true;
            this.expectedValue = expected;
            this.resolve = resolve1;
            fn();
        });
    }

    async expectNoLog(fn: () => void) {
        return new Promise<void>(resolve1 => {
            this.isAsserting = true;
            this.expectedValue = "^unexpected$";
            this.resolve = resolve1;
            fn();
            setTimeout(() => {
                this.resolve && this.resolve();
                this.resolve = undefined;
            }, 100);
        });
    }
}
