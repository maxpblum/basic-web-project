const PENTATONIC_INTERVAL_SEMIS = [2, 2, 3, 2, 3];
const pitches = intervalSemisToPitches(220, PENTATONIC_INTERVAL_SEMIS.concat(PENTATONIC_INTERVAL_SEMIS));

function intervalSemisToPitches(startPitch: number, semis: number[]): number[] {
  const output = [startPitch];
  for (const interval of semis) {
    output.push(output[output.length - 1]! * (2 ** (interval / 12.0)));
  }
  return output;
}

function loopPitches(nullsToPrepend: number, totalSlots: number, pitches: number[]): (number|null)[] {
  const output = Array(nullsToPrepend).fill(null);
  while (output.length < totalSlots) {
    output.push(pitches[(output.length - nullsToPrepend) % pitches.length]);
  }
  console.log(`Returning pitches: ${output}`);
  return output;
}

function schedulePitches(gain: GainNode, osc: OscillatorNode, startTime: number, pitches: number[]) {
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
  const gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);

  const oscNode = ctx.createOscillator();
  oscNode.type = 'triangle';
  oscNode.connect(gainNode);

  return {oscNode; gainNode};
}

export function getGraph() {
  const ctx = new AudioContext();

  const inst1 = getInstrument(ctx);
  const inst2 = getInstrument(ctx);
  const inst3 = getInstrument(ctx);

  return {
    play: function() {
      inst1.oscNode.start();
      inst2.oscNode.start();
      inst3.oscNode.start();
      schedulePitches(inst1.gainNode, inst1.oscNode, ctx.currentTime, loopPitches(0, 20, pitches));
      schedulePitches(inst2.gainNode, inst2.oscNode, ctx.currentTime, loopPitches(2, 20, pitches));
      schedulePitches(inst3.gainNode, inst3.oscNode, ctx.currentTime, loopPitches(4, 20, pitches));
    },
    stop: function() {
    },
  };
}
