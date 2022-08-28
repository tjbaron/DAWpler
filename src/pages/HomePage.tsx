import * as React from 'react';
import { Metronome } from '../components/Metronome';
import { Sequencer } from '../components/Sequencer';
import { VoiceVisualizer } from '../components/VoiceVisualizer';
import { useKeyboard } from '../hooks/useKeyboard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMetronome } from '../hooks/useMetronome';
import { frequencies, notes, scales, ScaleTypes } from '../helpers/noteData';
import { playNote, playTimeOnTrack, TrackNote } from '../helpers/synth';

const subBeats = 4;

const getBeat = ({ number, timestamp }: { number: number; timestamp: number }, bpm: number, subdiv: number) => {
    const msPerBeat = (1000 * 60) / bpm;
    const now = Date.now();
    return Math.round((number + (now - timestamp) / msPerBeat) * subdiv) / subdiv;
};

export const HomePage = () => {
    const [beat, setBeat] = React.useState({ number: 0, timestamp: 0 });
    const [track, setTrack, backTrack, forwardTrack] = useLocalStorage('lastTrack', [] as TrackNote[]);
    const [scale, setScale] = React.useState<ScaleTypes>('major');
    const [playing, setPlaying] = React.useState(false);
    useMetronome(100, subBeats, () => {
        const newBeat = {
            number: beat.number + 1 / subBeats,
            timestamp: new Date().getTime(),
        };
        setBeat(newBeat);
        if (playing) {
            playTimeOnTrack(newBeat.number, track);
        }
    });
    useKeyboard(
        (note) => {
            if (note === 'delete') {
                if (track.length > 0) setTrack(track.slice(0, -1));
            } else if (note === 'play') {
                if (!playing) {
                    setBeat({
                        ...beat,
                        number: -1,
                    });
                } else {
                    setBeat({
                        ...beat,
                        number: track.reduce((prev, curr) => {
                            const cx = Math.floor(curr.time + 1);
                            return Math.max(prev, cx);
                        }, 0),
                    });
                }
                setPlaying(!playing);
            } else if (note === 'back') {
                console.log('back');
                backTrack();
            } else if (note === 'forward') {
                forwardTrack();
            } else if (note === 'clear') {
                setTrack([]);
            } else {
                addNote(note);
            }
        },
        () => {
            return true;
        }
    );

    const addNote = (note: string) => {
        // console.log(note);
        // const lastNote = track[track.length - 1] || { note: '', time: 0, duration: 0 };

        const lastNote =
            track.reduce((prev, next) => {
                const p = prev.time + prev.duration;
                const n = next.time + next.duration;
                return p > n ? prev : next;
            }, track[0]) || ({ duration: 0, note: '', time: 0 } as TrackNote);
        const lastNoteFinish = lastNote.time + lastNote.duration;
        const currentBeatNum = getBeat(beat, 100, 4);
        let newBeat = currentBeatNum;
        if (currentBeatNum - lastNoteFinish > 5) {
            newBeat = lastNoteFinish;
            setBeat({
                ...beat,
                number: lastNoteFinish,
            });
        }
        // console.log(lastNoteFinish, currentBeatNum, newBeat);
        setTrack([
            ...track,
            {
                time: newBeat,
                duration: 1,
                note,
            },
        ]);
        playNote({
            frequency: frequencies[note],
            attackTime: 0.0,
            releaseTime: 0.0,
            sustainLevel: 0.9,
            duration: 0.1,
        });
    };
    const updateScale: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        setScale(e.currentTarget.value as ScaleTypes);
    };

    return (
        <>
            <header>
                <h1>DAWpler</h1>
                <div className="horizontal" />
                <div>{beat.number}</div>
                <div>{playing ? 'Playing' : 'Stopped'}</div>
                <Metronome silence={playing} beat={Math.floor(beat.number)} />
            </header>
            <div className="horizontal">
                <div className="vertical"></div>
                <div className="vertical">
                    <VoiceVisualizer />
                </div>
            </div>
            <div className="horizontal" style={{ overflow: 'auto' }}>
                {/* <div style={{ display: 'flex', width: '50px', height: '50px', overflow: 'hidden' }}> */}
                <button onClick={setTrack.bind(null, [])}>clear</button>
                <select onChange={updateScale}>
                    <option>major</option>
                    <option>minor</option>
                </select>
                <Sequencer addNote={addNote} track={track} setTrack={setTrack} scale={scale} beat={beat.number} />
                {/* </div> */}
            </div>
        </>
    );
};
