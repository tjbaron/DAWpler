import { frequencies } from './noteData';

const context = new AudioContext();

const volumeGain = context.createGain();
volumeGain.connect(context.destination);
volumeGain.gain.value = 0.1;

export interface NoteInputs {
    frequency: number;
    duration: number;
    sustainLevel: number;
    attackTime: number;
    releaseTime: number;
}

export interface TrackNote {
    time: number;
    duration: number;
    note: string;
}

export const playNote = ({ frequency, duration, sustainLevel, attackTime, releaseTime }: NoteInputs) => {
    const osc = context.createOscillator();
    const noteGain = context.createGain();
    noteGain.gain.setValueAtTime(0, 0);
    noteGain.gain.linearRampToValueAtTime(sustainLevel, context.currentTime + attackTime);
    noteGain.gain.setValueAtTime(sustainLevel, context.currentTime + duration - releaseTime);
    noteGain.gain.linearRampToValueAtTime(0, context.currentTime + duration);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(frequency, 0);
    osc.start(0);
    osc.stop(context.currentTime + 1);
    osc.connect(noteGain);
    noteGain.connect(volumeGain);
};

export const playTimeOnTrack = (beat: number, track: TrackNote[]) => {
    const notes = track.filter((e) => e.time === beat);
    notes.forEach((note) => {
        playNote({
            frequency: frequencies[note.note],
            attackTime: 0.0,
            releaseTime: 0.0,
            sustainLevel: 0.9,
            duration: 0.1 * note.duration,
        });
    });
};
