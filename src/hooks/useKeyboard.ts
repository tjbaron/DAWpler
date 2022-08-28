import { useEffect } from 'react';

const keyMap: { [key: string]: string } = {
    'a': 'c',
    's': 'd',
    'd': 'e',
    'f': 'f',
    'g': 'g',
    'h': 'a',
    'j': 'b',
    'w': 'c#',
    'e': 'd#',
    't': 'f#',
    'y': 'g#',
    'u': 'a#',
    'Backspace': 'delete',
    'p': 'play',
    ',': 'back',
    '.': 'forward',
    'c': 'clear',
};

export const useKeyboard = (startCb: (note: string) => void, endCb: (note: string) => void) => {
    useEffect(() => {
        const keydownFn: (e: KeyboardEvent) => void = (e) => {
            if (e.repeat) return;
            const note = keyMap[e.key];
            if (note) startCb(note);
        };
        document.body.addEventListener('keydown', keydownFn);
        const keyupFn: (e: KeyboardEvent) => void = (e) => {
            const note = keyMap[e.key];
            if (note) endCb(note);
        };
        document.body.addEventListener('keyup', keyupFn);
        return () => {
            document.body.removeEventListener('keydown', keydownFn);
            document.body.removeEventListener('keyup', keyupFn);
        };
    }, [startCb, endCb]);
};
