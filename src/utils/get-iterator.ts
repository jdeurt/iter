import type { AnyIterable } from "../types/any-iterable";
import { isAsyncIterable, isSyncIterable } from "./is-iterable";

type IteratorOf<I extends AnyIterable<unknown>> = I extends Iterable<infer T>
    ? Iterator<T>
    : I extends AsyncIterable<infer T>
    ? AsyncIterator<T>
    : never;

export const getAsyncIterator = <T>(iterable: AsyncIterable<T>) =>
    iterable[Symbol.asyncIterator]();

export const getSyncIterator = <T>(iterable: Iterable<T>) =>
    iterable[Symbol.iterator]();

export const getIterator = <I extends AnyIterable<unknown>>(iterable: I) => {
    if (isAsyncIterable(iterable)) {
        return getAsyncIterator(iterable) as IteratorOf<I>;
    }

    if (isSyncIterable(iterable)) {
        return getSyncIterator(iterable) as IteratorOf<I>;
    }

    throw new TypeError("Cannot get iterator of non-iterable.");
};
