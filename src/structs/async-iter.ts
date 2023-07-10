import { applyAsync } from "../helpers/iterable/apply";
import { flatMapAsync } from "../helpers/iterable/flat-map";
import { isAsyncIterable } from "../utils/is-iterable";
import { mapAsync } from "../helpers/iterable/map";
import { zipAsync } from "../helpers/iterable/zip";
import { scanAsync } from "../helpers/iterable/scan";
import type { MaybePromise } from "../types/maybe-promise";
import { interleaveAsync } from "../helpers/iterable/interleave";
import { takeAsync } from "../helpers/iterable/take";

export class AsyncIter<T> implements AsyncIterable<T> {
    [Symbol.asyncIterator]!: () => AsyncIterator<T>;

    constructor(iteratorFactory: () => AsyncIterator<T>) {
        this[Symbol.asyncIterator] = iteratorFactory;
    }

    static of<T>(value: T): AsyncIter<T> {
        // eslint-disable-next-line @typescript-eslint/require-await
        return new AsyncIter(async function* () {
            yield value;
        });
    }

    static from<T>(iterableOrIterator: AsyncIterable<T> | AsyncIterator<T>): AsyncIter<T> {
        if (isAsyncIterable(iterableOrIterator)) {
            return new AsyncIter(iterableOrIterator[Symbol.asyncIterator]);
        }

        return new AsyncIter(() => iterableOrIterator);
    }

    map<U>(mapFn: (value: T) => U): AsyncIter<U> {
        return AsyncIter.from(mapAsync(this, mapFn));
    }

    flatMap<U>(mapFn: (value: T) => AsyncIter<U>): AsyncIter<U> {
        return AsyncIter.from(flatMapAsync(this, mapFn));
    }

    apply<U>(apIter: AsyncIter<(value: T) => U>): AsyncIter<U> {
        return AsyncIter.from(applyAsync(this, apIter));
    }

    zipWith<U>(other: AsyncIter<U>): AsyncIter<[T, U]> {
        return AsyncIter.from(zipAsync(this, other));
    }

    interleaveWith(other: AsyncIter<T>): AsyncIter<T> {
        return AsyncIter.from(interleaveAsync(this, other));
    }

    enumerate(): AsyncIter<[number, T]> {
        let i = 0;

        return AsyncIter.from(mapAsync(this, (value) => [i++, value]));
    }

    concat(...others: AsyncIter<T>[]): AsyncIter<T> {
        return new AsyncIter(
            async function* (this: AsyncIter<T>) {
                yield* this;

                for (const iterable of others) {
                    yield* iterable;
                }
            }.bind(this)
        );
    }

    scan<U>(f: (accumulator: U, value: T) => U, initialValue: U): AsyncIter<U> {
        return AsyncIter.from(scanAsync(this, f, initialValue));
    }

    filter(predicate: (value: T) => MaybePromise<boolean>): AsyncIter<T> {
        return new AsyncIter(
            async function* (this: AsyncIter<T>) {
                for await (const value of this) {
                    if (await predicate(value)) {
                        yield value;
                    }
                }
            }.bind(this)
        );
    }

    take(n: number): AsyncIter<T> {
        return AsyncIter.from(takeAsync(this, n));
    }
}
