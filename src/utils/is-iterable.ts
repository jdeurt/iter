export const isAsyncIterable = <T>(value: unknown): value is AsyncIterable<T> =>
    typeof value === "object" &&
    value !== null &&
    Reflect.has(value, Symbol.asyncIterator);

export const isSyncIterable = <T>(value: unknown): value is Iterable<T> =>
    typeof value === "object" &&
    value !== null &&
    Reflect.has(value, Symbol.iterator);
