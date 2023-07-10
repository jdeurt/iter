import type { AnyIterable } from "../../types/any-iterable";
import { getAsyncIterator, getSyncIterator } from "../../utils/get-iterator";
import { isAsyncIterable, isSyncIterable } from "../../utils/is-iterable";

export const zipSync = <A, B>(
    iterableA: Iterable<A>,
    iterableB: Iterable<B>
): Iterable<[A, B]> => ({
    [Symbol.iterator]: function* () {
        const iteratorA = getSyncIterator(iterableA);
        const iteratorB = getSyncIterator(iterableB);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const a = iteratorA.next();
            const b = iteratorB.next();

            if (a.done || b.done) {
                break;
            }

            yield [a.value, b.value];
        }
    },
});

export const zipAsync = <A, B>(
    iterableA: AsyncIterable<A>,
    iterableB: AsyncIterable<B>
): AsyncIterable<[A, B]> => ({
    [Symbol.asyncIterator]: async function* () {
        const iteratorA = getAsyncIterator(iterableA);
        const iteratorB = getAsyncIterator(iterableB);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const [a, b] = await Promise.all([iteratorA.next(), iteratorB.next()]);

            if (a.done || b.done) {
                break;
            }

            yield [a.value, b.value];
        }
    },
});

interface Zip {
    <A, B>(iterableA: Iterable<A>, iterableB: Iterable<B>): Iterable<[A, B]>;
    <A, B>(iterableA: AsyncIterable<A>, iterableB: AsyncIterable<B>): AsyncIterable<[A, B]>;
}

export const zip = (<A, B>(iterableA: AnyIterable<A>, iterableB: AnyIterable<B>) => {
    if (isAsyncIterable(iterableA) && isAsyncIterable(iterableB)) {
        return zipAsync(iterableA, iterableB);
    }

    if (isSyncIterable(iterableA) && isSyncIterable(iterableB)) {
        return zipSync(iterableA, iterableB);
    }

    throw new TypeError(
        "Cannot zip iterables of unequal behavior. Expected input iterables A and B to both be async or both be sync."
    );
}) as Zip;
