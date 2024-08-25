export const getAudioDevices = async () => {
  await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
  return navigator.mediaDevices.enumerateDevices();
};

export const createAudioContext = (): AudioContext => {
  return new (AudioContext || (window as any).webkitAudioContext)({
    latencyHint: "balanced",
    sampleRate: 44100,
  });
};

export const createAudioStream = async (
  context: AudioContext,
  deviceId: string
): Promise<MediaStreamAudioSourceNode> => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: deviceId },
    video: false,
  });

  const source = context.createMediaStreamSource(mediaStream);
  return source;
};

const drawPath = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  bufferLength: number
) => {
  context.clearRect(0, 0, width, height);

  context.beginPath();

  const sliceWidth = (width * 1.0) / bufferLength;
  let x = 0;
  for (var i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * height) / 2;

    if (i === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }

    x += sliceWidth;
  }

  context.lineTo(width, height / 2);
  context.stroke();
};

const drawBars = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  dataArray: Uint8Array,
  bufferLength: number
) => {
  context.clearRect(0, 0, width, height);

  context.fillStyle = "rgb(0, 0, 0)";
  context.fillRect(0, 0, width, height);

  const barWidth = (width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    context.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
    context.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  }
};

export const runWaveAnalyser = (
  context: AudioContext,
  source: AudioNode,
  canvas: HTMLCanvasElement
) => {
  const canvasContext = canvas.getContext("2d")!;
  const { width, height } = canvas;

  const analyser = context.createAnalyser();
  source.connect(analyser);

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  let id: number | null = null;
  const draw = () => {
    analyser.getByteTimeDomainData(dataArray);

    drawPath(canvasContext, width, height, dataArray, bufferLength);

    id = requestAnimationFrame(draw);
  };

  draw();

  return () => {
    analyser.disconnect();
    if (id != null) {
      cancelAnimationFrame(id);
    }
  };
};

export const runFrequencyAnalyser = (
  context: AudioContext,
  source: AudioNode,
  canvas: HTMLCanvasElement
) => {
  const canvasContext = canvas.getContext("2d")!;
  const { width, height } = canvas;

  const analyser = context.createAnalyser();
  source.connect(analyser);

  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  let id: number | null = null;
  const draw = () => {
    analyser.getByteFrequencyData(dataArray);

    drawBars(canvasContext, width, height, dataArray, bufferLength);

    id = requestAnimationFrame(draw);
  };

  draw();

  return () => {
    analyser.disconnect();
    if (id != null) {
      cancelAnimationFrame(id);
    }
  };
};

// export const startSynth = async () => {
//   const wasm = await import("../pkg/index.js");

//   const ctx = new AudioContext();
//   const sampleRate = ctx.sampleRate;

//   const sec = 1;
//   const resBuf = wasm.synth(440, sec, sampleRate);

//   const audioBuffer = ctx.createBuffer(2, sec * sampleRate, sampleRate);
//   audioBuffer.getChannelData(0).set(resBuf);
//   audioBuffer.getChannelData(1).set(resBuf);
//   const source = ctx.createBufferSource();
//   source.buffer = audioBuffer;
//   source.connect(ctx.destination);
//   source.start();

//   setTimeout(() => {
//     source.stop();
//   }, 5000);
// };
