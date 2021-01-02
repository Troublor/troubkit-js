"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdoutTransport = void 0;
class stdoutTransport {
    transport() {
        return process.stdout;
    }
}
exports.StdoutTransport = new stdoutTransport();
//# sourceMappingURL=stdout-transport.js.map