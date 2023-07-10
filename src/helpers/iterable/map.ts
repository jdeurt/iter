import type { AnyIterable } from "../../types/any-iterable";
import { isAsyncIterable } from "../../utils/is-iterable";

export const mapSync = <A, B>(iterable: Iterable<A>, f: (value: A) => B): Iterable<B> => ({
    [Symbol.iterator]: function* () {
        for (const value of iterable) {
            yield f(value);
        }
    },
});

export const mapAsync = <A, B>(
    iterable: AsyncIterable<A>,
    f: (value: A) => B
): AsyncIterable<B> => ({
    [Symbol.asyncIterator]: async function* () {
        for await (const value of iterable) {
            yield f(value);
        }
    },
});

interface Map {
    <A, B>(iterable: Iterable<A>, f: (value: A) => B): Iterable<B>;
    <A, B>(iterable: AsyncIterable<A>, f: (value: A) => B): AsyncIterable<B>;
}

export const map = (<A, B>(iterable: AnyIterable<A>, f: (value: A) => B) =>
    isAsyncIterable(iterable) ? mapAsync(iterable, f) : mapSync(iterable, f)) as Map;
