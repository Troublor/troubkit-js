"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, {
        enumerable: true, get: function () {
            return m[k];
        }
    });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {value: true});
exports.ReactiveList = void 0;
const _ = __importStar(require("lodash"));
const index_1 = require("./index");
class ReactiveList {
    constructor(hooks = {}, ...dataList) {
        this.hooks = hooks;
        this.list = dataList;
    }
    toArray() {
        return _.cloneDeep(this.list);
    }
    length() {
        return this.list.length;
    }
    empty() {
        return this.list.length === 0;
    }
    beforeVisitHook(value) {
        if (this.hooks.onVisit) {
            const proceed = this.hooks.onVisit(value);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }
    beforeAddingHook(value) {
        if (this.list.length === 0) {
            if (this.hooks.onEmerge) {
                this.hooks.onEmerge(value);
            }
        }
        if (this.hooks.onIn) {
            const proceed = this.hooks.onIn(value);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }
    beforeDeletingHook(value) {
        if (this.list.length === 0) {
            if (this.hooks.onEmpty) {
                this.hooks.onEmpty();
            }
        }
        if (this.hooks.onOut) {
            const proceed = this.hooks.onOut(value);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }
    push(value) {
        if (this.beforeAddingHook(value)) {
            this.list.push(value);
        }
    }
    pop() {
        if (this.list.length === 0) {
            return undefined;
        }
        const v = this.list[this.list.length - 1];
        if (this.beforeDeletingHook(v)) {
            return this.list.shift();
        }
        return undefined;
    }
    shift() {
        if (this.list.length === 0) {
            return undefined;
        }
        const v = this.list[0];
        if (this.beforeDeletingHook(v)) {
            return this.list.shift();
        }
        return undefined;
    }
    unshift(value) {
        if (this.beforeAddingHook(value)) {
            this.list.unshift(value);
        }
    }
    remove(value) {
        if (this.beforeDeletingHook(value)) {
            index_1.removeItem(this.list, value);
        }
    }
    [Symbol.iterator]() {
        const iterator = {
            iter: this.list[Symbol.iterator](),
            next: (...args) => {
                const r = iterator.iter.next(...args);
                if (!r.done) {
                    if (!this.beforeVisitHook(r.value)) {
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
        if (this.beforeVisitHook(v)) {
            return v;
        }
        return undefined;
    }
}
exports.ReactiveList = ReactiveList;
//# sourceMappingURL=reactive-structures.js.map
