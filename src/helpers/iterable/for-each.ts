import type { AnyIterable } from "../../types/any-iterable";
import { isAsyncIterable } from "../../utils/is-iterable";
import { mapAsync, mapSync } from "./map";

interface ForEach {
    <T>(iterable: Iterable<T>, fn: (value: T) => void): Iterable<T>;
    <T>(iterable: AsyncIterable<T>, fn: (value: T) => void): AsyncIterable<T>;
}

export const forEach = (<T>(iterable: AnyIterable<T>, fn: (value: T) => void): AnyIterable<T> =>
    isAsyncIterable(iterable)
        ? mapAsync(iterable, (value) => (fn(value), value))
        : mapSync(iterable, (value) => (fn(value), value))) as ForEach;
