export declare enum Operation {
    PUSH = "push",
    POP = "pop",
    SHIFT = "shift",
    UNSHIFT = "unshift",
    INSERT = "insert",
    REMOVE = "remove",
    ITERATOR = "iterator",
    ELEM_AT = "elemAt",
    SPLICE = "splice",
    REMOVE_AT = "removeAt"
}

export interface ReactHooks<T> {
    beforeIn?: (value: T, operation: Operation) => boolean | void;
    afterIn?: (value: T, operation: Operation) => void;
    beforeOut?: (value: T, operation: Operation) => boolean | void;
    afterOut?: (value: T, operation: Operation) => void;
    onVisit?: (value: T, operation: Operation) => boolean | void;
    onEmpty?: (operation: Operation) => void;
    onEmerge?: (value: T, operation: Operation) => void;
}

export declare class ReactiveList<T> {
    readonly hooks: ReactHooks<T>;
    protected readonly list: T[];

    constructor(hooks?: ReactHooks<T>, ...dataList: T[]);

    toArray(): T[];

    length(): number;

    empty(): boolean;

    protected onVisitHook(value: T, operation: Operation): boolean;

    protected beforeAddingHook(value: T, operation: Operation): boolean;

    protected afterAddingHook(value: T, operation: Operation): void;

    protected beforeDeletingHook(value: T, operation: Operation): boolean;

    protected afterDeletingHook(value: T, operation: Operation): void;

    push(value: T): void;

    pop(): T | undefined;

    shift(): T | undefined;

    unshift(value: T): void;

    insert(index: number, value: T): void;

    remove(value: T): void;

    [Symbol.iterator](): Iterator<T>;

    elemAt(index: number): T | undefined;

    indexOf(value: T, fromIndex?: number): number;

    lastIndexOf(value: T, fromIndex?: number): number;

    splice(startIndex: number, deleteCount: number, ...insertElements: T[]): T[];

    removeAt(index: number): void;
}
