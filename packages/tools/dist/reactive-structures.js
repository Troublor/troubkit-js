"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.ReactiveList = exports.Operation = void 0;
var Operation;
(function (Operation) {
    Operation["PUSH"] = "push";
    Operation["POP"] = "pop";
    Operation["SHIFT"] = "shift";
    Operation["UNSHIFT"] = "unshift";
    Operation["INSERT"] = "insert";
    Operation["REMOVE"] = "remove";
    Operation["ITERATOR"] = "iterator";
    Operation["ELEM_AT"] = "elemAt";
    // INDEX_OF = "indexOf",
    // LAST_INDEX_OF = "lastIndexOf",
    Operation["SPLICE"] = "splice";
    Operation["REMOVE_AT"] = "removeAt";
})(Operation = exports.Operation || (exports.Operation = {}));

class ReactiveList {
    constructor(hooks = {}, ...dataList) {
        this.hooks = hooks;
        this.list = dataList;
    }

    toArray() {
        return [...this.list];
    }

    length() {
        return this.list.length;
    }

    empty() {
        return this.list.length === 0;
    }

    onVisitHook(value, operation) {
        if (this.hooks.onVisit) {
            const proceed = this.hooks.onVisit(value, operation);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }

    beforeAddingHook(value, operation) {
        if (this.list.length === 0) {
            if (this.hooks.onEmerge) {
                this.hooks.onEmerge(value, operation);
            }
        }
        if (this.hooks.beforeIn) {
            const proceed = this.hooks.beforeIn(value, operation);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }

    afterAddingHook(value, operation) {
        if (this.hooks.afterIn) {
            this.hooks.afterIn(value, operation);
        }
    }

    beforeDeletingHook(value, operation) {
        if (this.hooks.beforeOut) {
            const proceed = this.hooks.beforeOut(value, operation);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }

    afterDeletingHook(value, operation) {
        if (this.list.length === 0) {
            if (this.hooks.onEmpty) {
                this.hooks.onEmpty(operation);
            }
        }
        if (this.hooks.afterOut) {
            this.hooks.afterOut(value, operation);
        }
    }

    push(value) {
        if (this.beforeAddingHook(value, Operation.PUSH)) {
            this.list.push(value);
            this.afterAddingHook(value, Operation.PUSH);
        }
    }

    pop() {
        if (this.list.length === 0) {
            return undefined;
        }
        const v = this.list[this.list.length - 1];
        if (this.beforeDeletingHook(v, Operation.POP)) {
            const r = this.list.pop();
            this.afterDeletingHook(r, Operation.POP);
            return r;
        }
        return undefined;
    }
    shift() {
        if (this.list.length === 0) {
            return undefined;
        }
        const v = this.list[0];
        if (this.beforeDeletingHook(v, Operation.SHIFT)) {
            const r = this.list.shift();
            this.afterDeletingHook(r, Operation.SHIFT);
            return r;
        }
        return undefined;
    }

    unshift(value) {
        if (this.beforeAddingHook(value, Operation.UNSHIFT)) {
            this.list.unshift(value);
            this.afterAddingHook(value, Operation.UNSHIFT);
        }
    }

    insert(index, value) {
        if (this.beforeAddingHook(value, Operation.INSERT)) {
            this.list.splice(index, 0, value);
            this.afterAddingHook(value, Operation.INSERT);
        }
    }

    remove(value) {
        const index = this.list.indexOf(value);
        if (index < 0) {
            return;
        }
        if (this.beforeDeletingHook(value, Operation.REMOVE)) {
            this.list.splice(index, 1);
            this.afterDeletingHook(value, Operation.REMOVE);
        }
    }
    [Symbol.iterator]() {
        const iterator = {
            iter: this.list[Symbol.iterator](),
            next: (...args) => {
                const r = iterator.iter.next(...args);
                if (!r.done) {
                    if (!this.onVisitHook(r.value, Operation.ITERATOR)) {
                        return {
                            done: true,
                            value: undefined,
                        };
                    }
                }
                return r;
            },
        };
        return iterator;
    }

    elemAt(index) {
        if (index >= this.list.length) {
            return undefined;
        }
        const v = this.list[index];
        if (this.onVisitHook(v, Operation.ELEM_AT)) {
            return v;
        }
        return undefined;
    }

    indexOf(value, fromIndex) {
        return this.list.indexOf(value, fromIndex);
    }

    lastIndexOf(value, fromIndex) {
        return this.list.lastIndexOf(value, fromIndex);
    }

    splice(startIndex, deleteCount, ...insertElements) {
        const deletes = this.list.slice(startIndex, startIndex + deleteCount);
        const deletedElements = [];
        for (let i = 0; i < deletes.length; i++) {
            if (this.beforeDeletingHook(deletes[i], Operation.SPLICE)) {
                this.list.splice(startIndex + i, 1);
                this.afterDeletingHook(deletes[i], Operation.SPLICE);
                deletedElements.push(deletes[i]);
            }
        }
        for (const insertElement of insertElements) {
            if (this.beforeAddingHook(insertElement, Operation.SPLICE)) {
                this.list.splice(startIndex, 0, insertElement);
                this.afterAddingHook(insertElement, Operation.SPLICE);
            }
        }
        return deletedElements;
    }

    removeAt(index) {
        const elem = this.list[index];
        if (this.beforeDeletingHook(elem, Operation.REMOVE_AT)) {
            this.list.splice(index, 1);
            this.afterDeletingHook(elem, Operation.SPLICE);
        }
    }
}
exports.ReactiveList = ReactiveList;
//# sourceMappingURL=reactive-structures.js.map
