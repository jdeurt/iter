import type { AnyIterable } from "../../types/any-iterable";
import { getSyncIterator } from "../../utils/get-iterator";
import { isAsyncIterable } from "../../utils/is-iterable";

export const scanSync = <A, B>(
    iterable: Iterable<A>,
    f: (accumulator: B, value: A) => B,
    initialValue: B
): Iterable<B> => ({
    [Symbol.iterator]: function* () {
        const iterator = getSyncIterator(iterable);

        let accumulator = initialValue;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const next = iterator.next();

            if (next.done) {
                break;
            }

            accumulator = f(accumulator ?? initialValue, next.value);

            yield accumulator;
        }
    },
});

export const scanAsync = <A, B>(
    iterable: AsyncIterable<A>,
    f: (accumulator: B, value: A) => B,
    initialValue: B
): AsyncIterable<B> => ({
    [Symbol.asyncIterator]: async function* () {
        const iterator = iterable[Symbol.asyncIterator]();

        let accumulator = initialValue;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            const next = await iterator.next();

            if (next.done) {
                break;
            }

            accumulator = f(accumulator ?? initialValue, next.value);

            yield accumulator;
        }
    },
});

interface Scan {
    <A, B>(iterable: Iterable<A>, f: (accumulator: B, value: A) => B, initialValue: B): Iterable<B>;
    <A, B>(
        iterable: AsyncIterable<A>,
        f: (accumulator: B, value: A) => B,
        initialValue: B
    ): AsyncIterable<B>;
}

export const scan = (<A, B>(
    iterable: AnyIterable<A>,
    f: (accumulator: B, value: A) => B,
    initialValue: B
) =>
    isAsyncIterable(iterable)
        ? scanAsync(iterable, f, initialValue)
        : scanSync(iterable, f, initialValue)) as Scan;
