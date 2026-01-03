import * as Tone from 'tone';

const PENTATONIC_INTERVAL_SEMIS = [2, 2, 3, 2, 3] as const;
const PITCHES = intervalSemisToPitches(220, [
  ...PENTATONIC_INTERVAL_SEMIS,
  ...PENTATONIC_INTERVAL_SEMIS,
]);

function intervalSemisToPitches(startPitch: number, semis: number[]): number[] {
  const output = [startPitch];
  for (const interval of semis) {
    output.push(output[output.length - 1]! * 2 ** (interval / 12.0));
  }
  return output;
}

function loopPitches(
  nulls: number,
  total: number,
  source: number[],
): (number | null)[] {
  return Array.from({ length: total }, (_, i) =>
    i < nulls ? null : (source[(i - nulls) % source.length] ?? null),
  );
}

function schedulePitches(synth: Tone.Synth, pitches: (number | null)[]) {
  pitches.forEach((pitch, i) => {
    if (pitch == null) {
      return;
    } else {
      synth.triggerAttackRelease(pitch!, 1, i);
    }
  });
}

export const getGraph = () => {
  return {
    play() {
      schedulePitches(
        new Tone.Synth().toDestination(),
        loopPitches(0, 20, PITCHES),
      );
      schedulePitches(
        new Tone.Synth().toDestination(),
        loopPitches(2, 20, PITCHES),
      );
      schedulePitches(
        new Tone.Synth().toDestination(),
        loopPitches(4, 20, PITCHES),
      );
    },
    stop() {},
  };
};
