import * as React from 'react';
import { useMetronome } from '../hooks/useMetronome';
import { frequencies } from '../helpers/noteData';
import { playNote } from '../helpers/synth';

interface MetronomeProps {
    beat: number;
    silence: boolean;
}

export const Metronome = ({ beat, silence }: MetronomeProps) => {
    const [metronomeSound, setMetronomeSound] = React.useState(true);
    React.useEffect(() => {
        if (metronomeSound && !silence && beat >= 0) {
            playNote({
                frequency: frequencies['c'] / 2,
                attackTime: 0.0,
                releaseTime: 0.0,
                sustainLevel: 0.9,
                duration: 0.01,
            });
        }
    }, [beat]);
    return (
        <div
            className={`metronome ${beat % 2 === 0 ? 'metronome-even' : 'metronome-odd'}`}
            onClick={setMetronomeSound.bind(null, !metronomeSound)}
        ></div>
    );
};
