import * as React from 'react';
import { useRef } from 'react';
import { useAudioInput } from '../hooks/useAudioInput';
import { findNote } from '../helpers/noteData';

const visualize = (
    ctx: CanvasRenderingContext2D | undefined | null,
    bins: Uint8Array,
    sampleRate: number,
    frame: number
) => {
    let note = '';
    if (ctx) {
        ctx.clearRect(0, 0, 200, 1024);
        let maxes: number[] = [];
        let max = -1;
        let maxVal = 200;
        for (let i = 0; i < bins.length; i++) {
            if (bins[i] > maxVal) {
                max = i;
                maxes = [max];
                maxVal = bins[i];
            } else if (bins[i] === maxVal) {
                maxes = [...maxes, i];
            }
        }
        max = Math.floor(
            maxes.reduce((a, b) => {
                return a + b;
            }, 0) / maxes.length
        );
        if (max >= 0) {
            const frequency = Math.round((max * sampleRate) / 2 / 1024);
            note = findNote(frequency);

            ctx.beginPath();
            ctx.moveTo(0, max);
            ctx.lineTo(199, max);
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.fillStyle = 'red';
            ctx.font = '32px sans-serif';
            ctx.fillText(String(frequency) + ' ' + note, 10, max + 32);
        }

        const myImageData = ctx.createImageData(1, 1024);
        for (let i = 0; i < 1024; i++) {
            myImageData.data[i * 4] = bins[i];
            myImageData.data[i * 4 + 1] = bins[i];
            myImageData.data[i * 4 + 2] = bins[i];
            myImageData.data[i * 4 + 3] = 255;
        }
        ctx.putImageData(myImageData, frame + 200, 0);
    }
    return note;
};

export const VoiceVisualizer = () => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const renderFrameRef = useRef(0);
    useAudioInput((bins, sampleRate) => {
        visualize(canvasRef.current.getContext('2d'), bins, sampleRate, renderFrameRef.current);
        renderFrameRef.current = (renderFrameRef.current + 1) % 1024;
    });
    return (
        <canvas
            style={{ position: 'absolute', background: 'black', height: '100%' }}
            ref={canvasRef}
            width={1224}
            height={1024}
        ></canvas>
    );
};
