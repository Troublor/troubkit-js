import * as _ from "lodash";
import {removeItem} from "./index";

export interface ReactBehaviour<T> {
    onIn?: (value: T) => boolean | void,
    onOut?: (value: T) => boolean | void,
    onEmpty?: () => void,
    onEmerge?: (value: T) => void,
    onVisit?: (value: T) => boolean | void,
}

export class ReactiveList<T> {
    protected readonly list: T[];

    constructor(
        public readonly hooks: ReactBehaviour<T> = {},
        ...dataList: T[]
    ) {
        this.list = dataList;
    }

    public toArray(): T[] {
        return _.cloneDeep(this.list);
    }

    public length(): number {
        return this.list.length;
    }

    public empty(): boolean {
        return this.list.length === 0;
    }

    protected beforeVisitHook(value: T): boolean {
        if (this.hooks.onVisit) {
            const proceed = this.hooks.onVisit(value);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }

    protected beforeAddingHook(value: T): boolean {
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

    protected beforeDeletingHook(value: T): boolean {
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

    public push(value: T): void {
        if (this.beforeAddingHook(value)) {
            this.list.push(value);
        }
    }

    public pop(): T | undefined {
        if (this.list.length === 0) {
            return undefined;
        }
        const v = this.list[this.list.length - 1];
        if (this.beforeDeletingHook(v)) {
            return this.list.shift() as T;
        }
        return undefined;
    }

    public shift(): T | undefined {
        if (this.list.length === 0) {
            return undefined;
        }
        const v = this.list[0];
        if (this.beforeDeletingHook(v)) {
            return this.list.shift() as T;
        }
        return undefined;
    }

    public unshift(value: T): void {
        if (this.beforeAddingHook(value)) {
            this.list.unshift(value);
        }
    }

    public remove(value: T): void {
        if (this.beforeDeletingHook(value)) {
            removeItem(this.list, value);
        }
    }

    public [Symbol.iterator](): Iterator<T> {
        const iterator = {
            iter: this.list[Symbol.iterator](),
            next: (...args: []): IteratorResult<T, T | undefined> => {
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

    public elemAt(index: number): T | undefined {
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
