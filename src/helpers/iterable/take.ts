import type { AnyIterable } from "../../types/any-iterable";
import { isAsyncIterable } from "../../utils/is-iterable";

export const takeSync = <A>(iterable: Iterable<A>, n: number): Iterable<A> => ({
    [Symbol.iterator]: function* () {
        let i = 0;

        for (const value of iterable) {
            if (i >= n) {
                break;
            }

            yield value;

            i++;
        }
    },
});

export const takeAsync = <A>(iterable: AsyncIterable<A>, n: number): AsyncIterable<A> => ({
    [Symbol.asyncIterator]: async function* () {
        let i = 0;

        for await (const value of iterable) {
            if (i >= n) {
                break;
            }

            yield value;

            i++;
        }
    },
});

interface Take {
    <A>(iterable: Iterable<A>, n: number): Iterable<A>;
    <A>(iterable: AsyncIterable<A>, n: number): AsyncIterable<A>;
}

export const take = (<A>(iterable: AnyIterable<A>, n: number) =>
    isAsyncIterable(iterable) ? takeAsync(iterable, n) : takeSync(iterable, n)) as Take;
