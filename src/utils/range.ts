export const range = (from: number, to: number) => ({
    [Symbol.iterator]: function* () {
        for (let i = from; i <= to; i++) {
            yield i;
        }
    },
});
