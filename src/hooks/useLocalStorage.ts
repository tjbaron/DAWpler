import { useRef, useState } from 'react';

const getVal = (storageName: string) => {
    const v = localStorage.getItem(storageName);
    if (v) {
        return JSON.parse(v);
    }
};

export const useLocalStorage = <T>(storageName: string, initalValue: T) => {
    const [val, setVal] = useState(getVal(storageName) || initalValue);
    const backData = useRef([]);
    const forwardData = useRef([]);
    return [
        val,
        (newVal: T) => {
            backData.current.push(val);
            forwardData.current = [];
            localStorage.setItem(storageName, JSON.stringify(newVal));
            setVal(newVal);
        },
        () => {
            if (backData.current.length === 0) return;
            forwardData.current.push(val);
            const newVal = backData.current.pop();
            localStorage.setItem(storageName, JSON.stringify(newVal));
            setVal(newVal);
        },
        () => {
            if (forwardData.current.length === 0) return;
            backData.current.push(val);
            const newVal = forwardData.current.pop();
            localStorage.setItem(storageName, JSON.stringify(newVal));
            setVal(newVal);
        },
    ] as [T, (v: T) => void, () => void, () => void];
};
