export const toAsync = <A>(iterable: Iterable<A>): AsyncIterable<A> => ({
    // eslint-disable-next-line @typescript-eslint/require-await
    [Symbol.asyncIterator]: async function* () {
        yield* iterable;
    },
});
