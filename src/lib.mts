const PENTATONIC_INTERVAL_SEMIS = [2, 2, 3, 2, 3] as const;
const PITCHES = intervalSemisToPitches(220, [...PENTATONIC_INTERVAL_SEMIS, ...PENTATONIC_INTERVAL_SEMIS]);

function intervalSemisToPitches(startPitch: number, semis: number[]): number[] {
  const output = [startPitch];
  for (const interval of semis) {
    output.push(output[output.length - 1]! * (2 ** (interval / 12.0)));
  }
  return output;
}

function loopPitches(nulls: number, total: number, source: number[]): (number | null)[] {
  return Array.from({ length: total }, (_, i) => 
    i < nulls ? null : (source[(i - nulls) % source.length] ?? null)
  );
}

function schedulePitches(gain: GainNode, osc: OscillatorNode, startTime: number, pitches: (number | null)[]) {
  gain.gain.setValueAtTime(5, startTime);
  pitches.forEach((pitch, i) => {
    console.log(`Scheduling pitch ${pitch} for time ${startTime + i}`);
    if (pitch == null) {
      gain.gain.setValueAtTime(0, startTime + i);
    } else {
      gain.gain.setValueAtTime(0.5, startTime + i);
      osc.frequency.setValueAtTime(pitch!, startTime + i);
    }
  });
  gain.gain.setValueAtTime(0, startTime + pitches.length);
}

function getInstrument(ctx: AudioContext) {
  const gainNode = new GainNode(ctx);
  const oscNode = new OscillatorNode(ctx, { type: 'triangle' });
  
  oscNode.connect(gainNode).connect(ctx.destination);
  return { oscNode, gainNode };
};

export const getGraph = () => {
  const ctx = new AudioContext();
  const instruments = Array.from({ length: 3 }, () => getInstrument(ctx));

  return {
    play() {
      instruments.forEach(({ oscNode, gainNode }, i) => {
        oscNode.start();
        schedulePitches(gainNode, oscNode, ctx.currentTime, loopPitches(i * 2, 20, PITCHES));
      });
    },
    stop() {
      ctx.close();
    }
  };
};
