export const repeat = <T>(iterable: Iterable<T>): Iterable<T> => ({
    [Symbol.iterator]: function* () {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
            yield* iterable;
        }
    },
});
