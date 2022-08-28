import { useEffect, useRef, useState } from 'react';

const useInterval = (callback: () => void, delay: number) => {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export const useMetronome = (bpm: number, subBeats: number, cb?: () => void) => {
    const [evenBeat, setEvenBeat] = useState(false);
    useInterval(() => {
        setEvenBeat(!evenBeat);
        cb?.();
    }, (1000 * 60) / bpm / subBeats);
    return evenBeat;
};
