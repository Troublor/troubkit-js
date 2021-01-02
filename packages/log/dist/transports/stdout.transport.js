"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdoutTransport = void 0;
class stdoutTransport {
    transport() {
        return process.stdout;
    }
}
const StdoutTransport = () => new stdoutTransport();
exports.StdoutTransport = StdoutTransport;
//# sourceMappingURL=stdout.transport.js.map