import { useEffect } from 'react';

export const useKeyEvent = (startCb: (key: KeyboardEvent) => void, endCb: (key: KeyboardEvent) => void) => {
    useEffect(() => {
        const keydownFn: (e: KeyboardEvent) => void = (e) => {
            if (e.repeat) return;
            startCb(e);
        };
        document.body.addEventListener('keydown', keydownFn);
        const keyupFn: (e: KeyboardEvent) => void = (e) => {
            endCb(e);
        };
        document.body.addEventListener('keyup', keyupFn);
        return () => {
            document.body.removeEventListener('keydown', keydownFn);
            document.body.removeEventListener('keyup', keyupFn);
        };
    }, [startCb, endCb]);
};
