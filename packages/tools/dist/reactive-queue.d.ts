export declare class ReactiveList<T> {
    private readonly inReaction;
    private readonly outReaction;
    private queue;

    constructor(inReaction: (value: T) => void, outReaction: (value: T) => void);
}
