import type { MaybePromise } from "../types/maybe-promise";

export const foreverSync = <T>(f: () => T): Iterable<T> => ({
    [Symbol.iterator]: function* () {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            yield f();
        }
    },
});

export const foreverAsync = <T>(f: () => MaybePromise<T>): AsyncIterable<T> => ({
    // eslint-disable-next-line @typescript-eslint/require-await
    [Symbol.asyncIterator]: async function* () {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            yield f();
        }
    },
});
