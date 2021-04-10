"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamTransport = void 0;
function StreamTransport(stream) {
    class streamTransport {
        transport() {
            return stream;
        }
    }
    return new streamTransport();
}
exports.StreamTransport = StreamTransport;
//# sourceMappingURL=stream.transport.js.map