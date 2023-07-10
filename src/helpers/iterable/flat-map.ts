import type { AnyIterable } from "../../types/any-iterable";
import type { Fn } from "../../types/fn";
import { isAsyncIterable } from "../../utils/is-iterable";

export const flatMapSync = <A, B>(iterable: Iterable<A>, f: Fn<A, Iterable<B>>): Iterable<B> => ({
    [Symbol.iterator]: function* () {
        for (const value of iterable) {
            yield* f(value);
        }
    },
});

export const flatMapAsync = <A, B>(
    iterable: AsyncIterable<A>,
    f: Fn<A, AsyncIterable<B>>
): AsyncIterable<B> => ({
    [Symbol.asyncIterator]: async function* () {
        for await (const value of iterable) {
            yield* f(value);
        }
    },
});

interface FlatMap {
    <A, B>(iterable: Iterable<A>, f: Fn<A, Iterable<B>>): Iterable<B>;
    <A, B>(iterable: AsyncIterable<A>, f: Fn<A, AsyncIterable<B>>): AsyncIterable<B>;
}

export const flatMap = (<A, B>(iterable: AnyIterable<A>, f: Fn<A, AnyIterable<B>>) =>
    isAsyncIterable(iterable)
        ? flatMapAsync(iterable, f as Fn<A, AsyncIterable<B>>)
        : flatMapSync(iterable, f as Fn<A, Iterable<B>>)) as FlatMap;
