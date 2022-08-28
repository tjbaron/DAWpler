export const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

const noteHigh = 500;
const noteLow = 250;
export const frequencies: { [key: string]: number } = {
    'c': 261.63,
    'c#': 277.18,
    'd': 293.66,
    'd#': 311.13,
    'e': 329.63,
    'f': 349.23,
    'f#': 369.99,
    'g': 392.0,
    'g#': 415.3,
    'a': 440.0,
    'a#': 466.16,
    'b': 493.88,
};

export const scales = {
    major: [true, false, true, false, true, true, false, true, false, true, false, true],
    minor: [true, false, true, true, false, true, false, true, true, false, true, false],
};
export type ScaleTypes = keyof typeof scales;

export const findNote = (frequency: number) => {
    while (frequency > noteHigh) {
        frequency /= 2;
    }
    while (frequency < noteLow) {
        frequency *= 2;
    }
    let dist = 9999;
    let note = '?';
    console.log(frequency);
    for (const n in frequencies) {
        const nd = Math.abs(frequencies[n] - frequency);
        if (nd < dist) {
            dist = nd;
            note = n;
        }
    }
    return note;
};
