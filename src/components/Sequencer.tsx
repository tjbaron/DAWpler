import * as React from 'react';
import { useKeyEvent } from '../hooks/useKeyEvent';
import { notes, scales, ScaleTypes } from '../helpers/noteData';
import { TrackNote } from '../helpers/synth';

interface SequencerParams {
    scale: ScaleTypes;
    addNote: (note: string) => void;
    track: TrackNote[];
    setTrack: (v: TrackNote[]) => void;
    beat: number;
}

export const Sequencer = ({ scale, addNote, track, setTrack, beat }: SequencerParams) => {
    const [selectedNote, setSelectedNote] = React.useState(0);
    useKeyEvent(
        (e) => {
            // console.log(e.key);
            const newTrack = [...track];
            const d = track[selectedNote];
            if (e.key === 'ArrowLeft') {
                newTrack[selectedNote] = { ...d, time: d.time - 0.25 };
                setTrack(newTrack);
            } else if (e.key === 'ArrowRight') {
                newTrack[selectedNote] = { ...d, time: d.time + 0.25 };
                setTrack(newTrack);
            }
        },
        () => {
            return;
        }
    );
    return (
        <div className="keyboard">
            {notes.map((e, i) => {
                const active = scales[scale][i];
                return (
                    <div
                        key={i}
                        className="note-row"
                        style={{ color: active ? 'black' : 'gray' }}
                        onClick={addNote.bind(null, e)}
                    >
                        {e}
                    </div>
                );
            })}
            <div className="note-area">
                {track.map((e, i) => {
                    let noteColor = 'black';
                    if (selectedNote === i) {
                        noteColor = 'rgb(40,168,200)';
                    } else if (beat === e.time) {
                        noteColor = 'rgb(20,84,100)';
                    }
                    return (
                        <div
                            key={i}
                            className="note"
                            style={{
                                left: e.time * 11,
                                top: notes.indexOf(e.note) * 31,
                                width: e.duration * 11 - 1,
                                background: noteColor,
                            }}
                            onClick={() => {
                                setSelectedNote(i);
                            }}
                        ></div>
                    );
                })}
                <div className="play-head" style={{ left: `${beat * 11}px` }}></div>
            </div>
        </div>
    );
};
