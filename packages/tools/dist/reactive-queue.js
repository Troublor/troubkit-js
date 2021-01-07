"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ReactiveList = void 0;

class ReactiveList {
    constructor(inReaction, outReaction) {
        this.inReaction = inReaction;
        this.outReaction = outReaction;
        this.queue = [];
    }
}

exports.ReactiveList = ReactiveList;
//# sourceMappingURL=reactive-queue.js.map
