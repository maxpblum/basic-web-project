const PENTATONIC_INTERVAL_SEMIS = [2, 2, 3, 2, 3];

function intervalSemisToPitches(startPitch: number, semis: number[]): number[] {
  const output = [startPitch];
  for (const interval of semis) {
    output.push(output[output.length - 1]! * (2 ** (interval / 12.0)));
  }
  return output;
}

function setPitchesAtSeconds(osc: OscillatorNode, startTime: number, pitches: number[]) {
  for (let i = 0; i < pitches.length; i++) {
    osc.frequency.setValueAtTime(pitches[i]!, startTime + i);
  }
}

export function getGraph() {
  const ctx = new AudioContext();

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.connect(ctx.destination);

  const oscNode = ctx.createOscillator();
  oscNode.type = 'square';
  oscNode.frequency.setValueAtTime(220, ctx.currentTime);
  oscNode.connect(gainNode);

  return {
    play: function() {
      try { oscNode.start(); } catch {}
      setPitchesAtSeconds(oscNode, ctx.currentTime, intervalSemisToPitches(220, PENTATONIC_INTERVAL_SEMIS.concat(PENTATONIC_INTERVAL_SEMIS)));
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      console.log('did play');
    },
    stop: function() {
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      console.log('did stop');
    },
  };
}
