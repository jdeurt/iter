import type { AnyIterable } from "../../types/any-iterable";
import type { Fn } from "../../types/fn";
import { isAsyncIterable } from "../../utils/is-iterable";
import { zipAsync, zipSync } from "./zip";

export const applySync = <A, B>(iterable: Iterable<A>, fab: Iterable<Fn<A, B>>): Iterable<B> => ({
    [Symbol.iterator]: function* () {
        for (const [value, f] of zipSync(iterable, fab)) {
            yield f(value);
        }
    },
});

export const applyAsync = <A, B>(
    iterable: AsyncIterable<A>,
    fab: AsyncIterable<Fn<A, B>>
): AsyncIterable<B> => ({
    [Symbol.asyncIterator]: async function* () {
        for await (const [value, f] of zipAsync(iterable, fab)) {
            yield f(value);
        }
    },
});

interface Apply {
    <A, B>(iterable: Iterable<A>, fab: Iterable<Fn<A, B>>): Iterable<B>;
    <A, B>(iterable: AsyncIterable<A>, fab: AsyncIterable<Fn<A, B>>): AsyncIterable<B>;
}

export const apply = (<A, B>(iterable: AnyIterable<A>, fab: AnyIterable<Fn<A, B>>) =>
    isAsyncIterable(iterable)
        ? applyAsync(iterable, fab as AsyncIterable<Fn<A, B>>)
        : applySync(iterable, fab as Iterable<Fn<A, B>>)) as Apply;
