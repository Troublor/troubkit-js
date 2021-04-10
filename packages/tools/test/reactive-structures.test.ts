import {ReactiveList} from "../lib";
import {Operation} from "../lib";

describe("ReactiveList", () => {
    test("toArray should return a shallow copy", () => {
        const rl = new ReactiveList({},
            {
                v: 0,
            },
            {
                v: 1,
            },
        );
        const arr = rl.toArray();
        expect(arr).toEqual([rl.elemAt(0), rl.elemAt(1)]);

        // changing element should make a difference
        arr[0].v = 1;
        expect(rl.elemAt(0)).toEqual({v: 1});

        // changing array should not make difference
        arr.pop();
        expect(rl.length()).not.toEqual(1);
    });

    test("length should return list length", () => {
        expect(new ReactiveList({}, 1, 2, 3).length()).toBe(3);
    });

    test("empty should return true if list is empty", () => {
        expect(new ReactiveList().empty()).toBe(true);
    });

    test("push should call beforeIn and afterIn hooks", () => {
        const called: boolean[] = [];
        const rl = new ReactiveList<number>({
            beforeIn: (value, op) => {
                expect(op).toBe(Operation.PUSH);
                expect(value).toBe(1);
                called.push(true);
            },
            afterIn: (value, op) => {
                expect(op).toBe(Operation.PUSH);
                expect(value).toBe(1);
                called.push(true);
            },
        }, 0);

        rl.push(1);
        expect(rl.elemAt(1)).toBe(1);
        expect(rl.toArray()).toEqual([0, 1]);
        expect(called).toEqual([true, true]);
    });

    test("push should abort when beforeIn returns false", () => {
        const rl = new ReactiveList<number>({
            beforeIn: () => {
                return false;
            },
        });
        rl.push(1);
        expect(rl.length()).toBe(0);
    });

    test("pop should call beforeOut and afterOut hooks", () => {
        const called: boolean[] = [];
        const rl = new ReactiveList<number>({
            beforeOut: (value, op) => {
                expect(op).toBe(Operation.POP);
                expect(value).toBe(1);
                called.push(true);
            },
            afterOut: (value, op) => {
                expect(op).toBe(Operation.POP);
                expect(value).toBe(1);
                called.push(true);
            },
        }, 0, 1);

        const e = rl.pop();
        expect(e).toBe(1);
        expect(called).toEqual([true, true]);
    });

    test("pop should abort when beforeOut returns false", () => {
        const rl = new ReactiveList<number>({
            beforeOut: () => {
                return false;
            },
        }, 0, 1);
        const e = rl.pop();
        expect(e).toBe(undefined);
        expect(rl.length()).toBe(2);
    });

    test("pop should undefined when list is empty", () => {
        const rl = new ReactiveList<number>({
            beforeOut: () => {
                return false;
            },
        });
        const e = rl.pop();
        expect(e).toBe(undefined);
    });

    test("unshift should call beforeIn and afterIn hooks", () => {
        const called: boolean[] = [];
        const rl = new ReactiveList<number>({
            beforeIn: (value, op) => {
                expect(op).toBe(Operation.UNSHIFT);
                expect(value).toBe(1);
                called.push(true);
            },
            afterIn: (value, op) => {
                expect(op).toBe(Operation.UNSHIFT);
                expect(value).toBe(1);
                called.push(true);
            },
        }, 2);

        rl.unshift(1);
        expect(rl.elemAt(0)).toBe(1);
        expect(rl.toArray()).toEqual([1, 2]);
        expect(called).toEqual([true, true]);
    });

    test("unshift should abort when beforeIn returns false", () => {
        const rl = new ReactiveList<number>({
            beforeIn: () => {
                return false;
            },
        });
        rl.unshift(1);
        expect(rl.length()).toBe(0);
    });

    test("shift should call beforeOut and afterOut hooks", () => {
        const called: boolean[] = [];
        const rl = new ReactiveList<number>({
            beforeOut: (value, op) => {
                expect(op).toBe(Operation.SHIFT);
                expect(value).toBe(0);
                called.push(true);
            },
            afterOut: (value, op) => {
                expect(op).toBe(Operation.SHIFT);
                expect(value).toBe(0);
                called.push(true);
            },
        }, 0, 1);

        const e = rl.shift();
        expect(e).toBe(0);
        expect(called).toEqual([true, true]);
    });

    test("shift should abort when beforeOut returns false", () => {
        const rl = new ReactiveList<number>({
            beforeOut: () => {
                return false;
            },
        }, 0, 1);
        const e = rl.shift();
        expect(e).toBe(undefined);
        expect(rl.length()).toBe(2);
    });

    test("shift should undefined when list is empty", () => {
        const rl = new ReactiveList<number>({
            beforeOut: () => {
                return false;
            },
        });
        const e = rl.shift();
        expect(e).toBe(undefined);
    });

    test("remove should do nothing when list is empty", () => {
        const rl = new ReactiveList();
        rl.remove(1);
        expect(rl.length()).toBe(0);
    });

    test("remove should do nothing when value is not found", () => {
        const rl = new ReactiveList({}, 1);
        rl.remove(0);
        expect(rl.length()).toBe(1);
    });

    test("remove should call beforeOut and afterOut hooks", () => {
        const called: boolean[] = [];
        const rl = new ReactiveList({
            beforeOut: (value, operation) => {
                expect(value).toBe(1);
                expect(operation).toBe(Operation.REMOVE);
                called.push(true);
            },
            afterOut: (value, operation) => {
                expect(value).toBe(1);
                expect(operation).toBe(Operation.REMOVE);
                called.push(true);
            },
        }, 1);
        rl.remove(1);
        expect(rl.length()).toBe(0);
        expect(called).toEqual([true, true]);
    });

    test("onEmptyHook should be called when list is empty after remove", () => {
        let called = false;
        const rl = new ReactiveList({
            onEmpty: operation => {
                expect(operation).toBe(Operation.REMOVE);
                called = true;
            },
        }, 1);
        rl.remove(1);
        expect(called).toBe(true);
    });

    test("insert should call beforeIn and afterIn hooks", () => {
        const called: boolean[] = [];
        const rl = new ReactiveList({
            beforeIn: (value, operation) => {
                expect(value).toBe(1);
                expect(operation).toBe(Operation.INSERT);
                called.push(true);
            },
            afterIn: (value, operation) => {
                expect(value).toBe(1);
                expect(operation).toBe(Operation.INSERT);
                called.push(true);
            },
        }, 0, 2);
        rl.insert(1, 1);
        expect(rl.length()).toBe(3);
        expect(rl.elemAt(1)).toBe(1);
        expect(called).toEqual([true, true]);
    });

    test("onEmergeHook should be called when empty list is added value", () => {
        let called = false;
        const rl = new ReactiveList({
            onEmerge: (value, operation) => {
                expect(operation).toBe(Operation.INSERT);
                called = true;
            },
        });
        rl.insert(1, 0);
        expect(called).toBe(true);
    });
});
