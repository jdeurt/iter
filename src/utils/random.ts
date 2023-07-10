import { foreverSync } from "./forever";

const randomFloat = (from: number, to: number, generator = Math.random) => {
    const min = Math.min(from, to);
    const max = Math.max(from, to);

    return generator() * (max - min) + min;
};

const randomInt = (from: number, to: number, generator = Math.random) => {
    const min = Math.ceil(Math.min(from, to));
    const max = Math.floor(Math.max(from, to));

    return Math.floor(generator() * (max - min + 1)) + min;
};

export const randomFloats = (
    range?: [from: number, to: number],
    generator = Math.random
): Iterable<number> => {
    const [from, to] = range ?? [0, Number.MAX_VALUE];

    return {
        [Symbol.iterator]: function* () {
            yield* foreverSync(() => randomFloat(from, to, generator));
        },
    };
};

export const randomInts = (
    range?: [from: number, to: number],
    generator = Math.random
): Iterable<number> => {
    const [from, to] = range ?? [0, Number.MAX_SAFE_INTEGER];

    return {
        [Symbol.iterator]: function* () {
            yield* foreverSync(() => randomInt(from, to, generator));
        },
    };
};
