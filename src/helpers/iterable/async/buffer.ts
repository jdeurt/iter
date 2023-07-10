export const buffer = <A>(iterable: AsyncIterable<A>, ms: number): AsyncIterable<A> => ({
    [Symbol.asyncIterator]: async function* () {
        for await (const value of iterable) {
            yield value;

            await new Promise((resolve) => setTimeout(resolve, ms));
        }
    },
});
