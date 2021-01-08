export enum Operation {
    PUSH = "push",
    POP = "pop",
    SHIFT = "shift",
    UNSHIFT = "unshift",
    INSERT = "insert",
    REMOVE = "remove",
    ITERATOR = "iterator",
    ELEM_AT = "elemAt",
    // INDEX_OF = "indexOf",
    // LAST_INDEX_OF = "lastIndexOf",
    SPLICE = "splice",
    REMOVE_AT = "removeAt",
}

export interface ReactHooks<T> {
    beforeIn?: (value: T, operation: Operation) => boolean | void,
    afterIn?: (value: T, operation: Operation) => void,

    beforeOut?: (value: T, operation: Operation) => boolean | void,
    afterOut?: (value: T, operation: Operation) => void,

    onVisit?: (value: T, operation: Operation) => boolean | void,

    onEmpty?: (operation: Operation) => void,

    onEmerge?: (value: T, operation: Operation) => void,
}

export class ReactiveList<T> {
    protected readonly list: T[];

    constructor(
        public readonly hooks: ReactHooks<T> = {},
        ...dataList: T[]
    ) {
        this.list = dataList;
    }

    public toArray(): T[] {
        return [...this.list];
    }

    public length(): number {
        return this.list.length;
    }

    public empty(): boolean {
        return this.list.length === 0;
    }

    protected onVisitHook(value: T, operation: Operation): boolean {
        if (this.hooks.onVisit) {
            const proceed = this.hooks.onVisit(value, operation);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }

    protected beforeAddingHook(value: T, operation: Operation): boolean {
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

    protected afterAddingHook(value: T, operation: Operation): void {
        if (this.hooks.afterIn) {
            this.hooks.afterIn(value, operation);
        }
    }

    protected beforeDeletingHook(value: T, operation: Operation): boolean {
        if (this.hooks.beforeOut) {
            const proceed = this.hooks.beforeOut(value, operation);
            return !(proceed !== undefined && !proceed);
        }
        return true;
    }

    protected afterDeletingHook(value: T, operation: Operation): void {
        if (this.list.length === 0) {
            if (this.hooks.onEmpty) {
                this.hooks.onEmpty(operation);
            }
        }
        if (this.hooks.afterOut) {
            this.hooks.afterOut(value, operation);
        }
    }

    public push(value: T): void {
        if (this.beforeAddingHook(value, Operation.PUSH)) {
            this.list.push(value);
            this.afterAddingHook(value, Operation.PUSH);
        }
    }

    public pop(): T | undefined {
        if (this.list.length === 0) {
            return undefined;
        }
        const v = this.list[this.list.length - 1];
        if (this.beforeDeletingHook(v, Operation.POP)) {
            const r = this.list.pop() as T;
            this.afterDeletingHook(r, Operation.POP);
            return r;
        }
        return undefined;
    }

    public shift(): T | undefined {
        if (this.list.length === 0) {
            return undefined;
        }
        const v = this.list[0];
        if (this.beforeDeletingHook(v, Operation.SHIFT)) {
            const r = this.list.shift() as T;
            this.afterDeletingHook(r, Operation.SHIFT);
            return r;
        }
        return undefined;
    }

    public unshift(value: T): void {
        if (this.beforeAddingHook(value, Operation.UNSHIFT)) {
            this.list.unshift(value);
            this.afterAddingHook(value, Operation.UNSHIFT);
        }
    }

    public insert(index: number, value: T): void {
        if (this.beforeAddingHook(value, Operation.INSERT)) {
            this.list.splice(index, 0, value);
            this.afterAddingHook(value, Operation.INSERT);
        }
    }

    public remove(value: T): void {
        const index = this.list.indexOf(value);
        if (index < 0) {
            return;
        }
        if (this.beforeDeletingHook(value, Operation.REMOVE)) {
            this.list.splice(index, 1);
            this.afterDeletingHook(value, Operation.REMOVE);
        }
    }

    public [Symbol.iterator](): Iterator<T> {
        const iterator = {
            iter: this.list[Symbol.iterator](),
            next: (...args: []): IteratorResult<T, T | undefined> => {
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

    public elemAt(index: number): T | undefined {
        if (index >= this.list.length) {
            return undefined;
        }
        const v = this.list[index];
        if (this.onVisitHook(v, Operation.ELEM_AT)) {
            return v;
        }
        return undefined;
    }

    public indexOf(value: T, fromIndex?: number): number {
        return this.list.indexOf(value, fromIndex);
    }

    public lastIndexOf(value: T, fromIndex?: number): number {
        return this.list.lastIndexOf(value, fromIndex);
    }

    public splice(startIndex: number, deleteCount: number, ...insertElements: T[]): T[] {
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

    public removeAt(index: number): void {
        const elem = this.list[index];
        if (this.beforeDeletingHook(elem, Operation.REMOVE_AT)) {
            this.list.splice(index, 1);
            this.afterDeletingHook(elem, Operation.SPLICE);
        }
    }
}
