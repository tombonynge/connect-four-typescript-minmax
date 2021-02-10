export const randomInteger = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const copyArray = (a: number[][]) => {
    // hacky way to copy a nested array
    return JSON.parse(JSON.stringify(a));
};

export const transpose = (m: number[][]) => {
    return m[0].map((x, i) => m.map((x) => x[i]));
};
