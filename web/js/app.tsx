import { useEffect } from "react";

export const App = () => {
  return (
    <div>
      <button
        onClick={async () => {
          const wasm = await import("../pkg/index.js");

          window.AudioContext =
            window.AudioContext || (window as any).webkitAudioContext;
          const ctx = new AudioContext();
          const sampleRate = ctx.sampleRate;

          const sec = 1;
          const resBuf = wasm.synth(440, sec, sampleRate);

          const audioBuffer = ctx.createBuffer(2, sec * sampleRate, sampleRate);
          audioBuffer.getChannelData(0).set(resBuf);
          audioBuffer.getChannelData(1).set(resBuf);
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.start();

          setTimeout(() => {
            source.stop();
          }, 5000);
        }}
      >
        start
      </button>
    </div>
  );
};
