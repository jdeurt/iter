import type { AnyIterable } from "../../types/any-iterable";
import { getAsyncIterator, getSyncIterator } from "../../utils/get-iterator";
import { isAsyncIterable, isSyncIterable } from "../../utils/is-iterable";

export const interleaveSync = <A>(iterableA: Iterable<A>, iterableB: Iterable<A>): Iterable<A> => ({
    [Symbol.iterator]: function* () {
        const iteratorA = getSyncIterator(iterableA);
        const iteratorB = getSyncIterator(iterableB);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const a = iteratorA.next();
            const b = iteratorB.next();

            if (a.done && b.done) {
                break;
            }

            if (!a.done) {
                yield a.value;
            }

            if (!b.done) {
                yield b.value;
            }
        }
    },
});

export const interleaveAsync = <A>(
    iterableA: AsyncIterable<A>,
    iterableB: AsyncIterable<A>
): AsyncIterable<A> => ({
    [Symbol.asyncIterator]: async function* () {
        const iteratorA = getAsyncIterator(iterableA);
        const iteratorB = getAsyncIterator(iterableB);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            let yielded = 0;

            const a = await iteratorA.next();

            if (!a.done) {
                yield a.value;
                yielded++;
            }

            const b = await iteratorB.next();

            if (!b.done) {
                yield b.value;
                yielded++;
            }

            if (yielded === 0) {
                break;
            }
        }
    },
});

interface Interleave {
    <A>(iterableA: Iterable<A>, iterableB: Iterable<A>): Iterable<A>;
    <A>(iterableA: AsyncIterable<A>, iterableB: AsyncIterable<A>): AsyncIterable<A>;
}

export const interleave = (<A>(iterableA: AnyIterable<A>, iterableB: AnyIterable<A>) => {
    if (isAsyncIterable(iterableA) && isAsyncIterable(iterableB)) {
        return interleaveAsync(iterableA, iterableB);
    }

    if (isSyncIterable(iterableA) && isSyncIterable(iterableB)) {
        return interleaveSync(iterableA, iterableB);
    }

    throw new TypeError(
        "Cannot interleave iterables of unequal behavior. Expected input iterables A and B to both be async or both be sync."
    );
}) as Interleave;
