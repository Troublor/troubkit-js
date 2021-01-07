export interface ReactBehaviour<T> {
    onIn?: (value: T) => boolean | void;
    onOut?: (value: T) => boolean | void;
    onEmpty?: () => void;
    onEmerge?: (value: T) => void;
    onVisit?: (value: T) => boolean | void;
}

export declare class ReactiveList<T> {
    readonly hooks: ReactBehaviour<T>;
    protected readonly list: T[];

    constructor(hooks?: ReactBehaviour<T>, ...dataList: T[]);

    toArray(): T[];

    length(): number;

    empty(): boolean;

    protected beforeVisitHook(value: T): boolean;

    protected beforeAddingHook(value: T): boolean;

    protected beforeDeletingHook(value: T): boolean;

    push(value: T): void;

    pop(): T | undefined;

    shift(): T | undefined;

    unshift(value: T): void;

    remove(value: T): void;

    [Symbol.iterator](): Iterator<T>;

    elemAt(index: number): T | undefined;
}
