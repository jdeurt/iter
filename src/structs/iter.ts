import { applySync } from "../helpers/iterable/apply";
import { flatMapSync } from "../helpers/iterable/flat-map";
import { isSyncIterable } from "../utils/is-iterable";
import { mapSync } from "../helpers/iterable/map";
import { zipSync } from "../helpers/iterable/zip";
import { scanSync } from "../helpers/iterable/scan";
import { AsyncIter } from "./async-iter";
import { toAsync } from "../helpers/iterable/to-async";
import { interleaveSync } from "../helpers/iterable/interleave";
import { foreverSync } from "../utils/forever";
import { randomFloats, randomInts } from "../utils/random";
import { range as rangeFn } from "../utils/range";
import { repeat } from "../utils/repeat";
import { takeSync } from "../helpers/iterable/take";

export class Iter<T> implements Iterable<T> {
    [Symbol.iterator]!: () => Iterator<T>;

    constructor(iteratorFactory: () => Iterator<T>) {
        this[Symbol.iterator] = iteratorFactory;
    }

    static forever<T>(f: () => T): Iter<T> {
        return Iter.from(foreverSync(f));
    }

    static randomFloats(range?: [from: number, to: number], generator = Math.random): Iter<number> {
        return Iter.from(randomFloats(range, generator));
    }

    static randomInts(range?: [from: number, to: number], generator = Math.random): Iter<number> {
        return Iter.from(randomInts(range, generator));
    }

    static range([from, to]: [from: number, to: number]): Iter<number> {
        return Iter.from(rangeFn(from, to));
    }

    static repeat<T>(iterable: Iterable<T>): Iter<T> {
        return Iter.from(repeat(iterable));
    }

    static of<T>(value: T): Iter<T> {
        return new Iter(function* () {
            yield value;
        });
    }

    static from<T>(iterableOrIterator: Iterable<T> | Iterator<T>): Iter<T> {
        if (isSyncIterable(iterableOrIterator)) {
            return new Iter(iterableOrIterator[Symbol.iterator]);
        }

        return new Iter(() => iterableOrIterator);
    }

    map<U>(mapFn: (value: T) => U): Iter<U> {
        return Iter.from(mapSync(this, mapFn));
    }

    flatMap<U>(mapFn: (value: T) => Iter<U>): Iter<U> {
        return Iter.from(flatMapSync(this, mapFn));
    }

    apply<U>(apIter: Iter<(value: T) => U>): Iter<U> {
        return Iter.from(applySync(this, apIter));
    }

    zipWith<U>(other: Iter<U>): Iter<[T, U]> {
        return Iter.from(zipSync(this, other));
    }

    interleaveWith(other: Iter<T>): Iter<T> {
        return Iter.from(interleaveSync(this, other));
    }

    enumerate(): Iter<[number, T]> {
        let i = 0;

        return Iter.from(mapSync(this, (value) => [i++, value]));
    }

    concat(...others: Iter<T>[]): Iter<T> {
        return Iter.from(flatMapSync([this, ...others], (value) => value));
    }

    scan<U>(f: (accumulator: U, value: T) => U, initialValue: U): Iter<U> {
        return Iter.from(scanSync(this, f, initialValue));
    }

    filter(predicate: (value: T) => boolean): Iter<T> {
        return Iter.from(flatMapSync(this, (value) => (predicate(value) ? [value] : [])));
    }

    take(n: number): Iter<T> {
        return Iter.from(takeSync(this, n));
    }

    toAsync(): AsyncIter<T> {
        return AsyncIter.from(toAsync(this));
    }
}
