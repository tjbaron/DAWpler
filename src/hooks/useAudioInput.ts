import { useEffect, useRef, useState } from 'react';
import { IMediaRecorder, MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

type AudioInputCallback = (bins: Uint8Array, sampleRate: number) => void;

export const useAudioInput = (fftCallback: (bins: Uint8Array, sampleRate: number) => void) => {
    const [stream, setStream] = useState<MediaStream>();
    const [recorder, setRecorder] = useState<IMediaRecorder>();
    const [chunks, setChunks] = useState<Blob[]>([]);
    const [sampleRate, setSampleRate] = useState<number>();
    const callbackRef = useRef<AudioInputCallback>();
    callbackRef.current = fftCallback;
    useEffect(() => {
        (async () => {
            try {
                await register(await connect());
            } catch (e) {
                // console.warn('WAV encoder already registered.');
            }

            const st = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(st);

            const rec = new MediaRecorder(st, { mimeType: 'audio/wav' });
            rec.ondataavailable = (e) => {
                setChunks([...chunks, e.data]);
            };
            setRecorder(rec);

            const audioCtx = new window.AudioContext();
            setSampleRate(audioCtx.sampleRate);
            const analyser = audioCtx.createAnalyser();
            analyser.smoothingTimeConstant = 0.1;
            const source = audioCtx.createMediaStreamSource(st);
            source.connect(analyser);
            setInterval(() => {
                analyser.fftSize = 2048;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);
                callbackRef.current(dataArray, audioCtx.sampleRate);
            }, 150);
        })();
        return () => {
            stream?.getTracks()?.[0]?.stop();
        };
    }, []);
    return {
        download: () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'audio.wav';
            a.click();
            window.URL.revokeObjectURL(url);
        },
        start: () => {
            recorder?.start();
        },
        stop: () => {
            recorder?.stop();
        },
        sampleRate,
        _stream: stream,
        _recorder: recorder,
    };
};
