import { useEffect, useRef, useState } from "react";
import {
  createAudioContext,
  getAudioDevices,
  createAudioStream,
  runWaveAnalyser,
  runFrequencyAnalyser,
} from "./audio";

const DeviceSelector = ({
  devices,
  onSelectInput,
  onSelectOutupt,
}: {
  devices: MediaDeviceInfo[];
  onSelectInput: (id: string) => void;
  onSelectOutupt: (id: string) => void;
}) => {
  const inputs = devices.filter((d) => d.kind === "audioinput");
  const outputs = devices.filter((d) => d.kind === "audiooutput");
  return (
    <div>
      <div>
        <div>input</div>
        <div>
          {inputs.map((d) => {
            return (
              <div key={d.deviceId}>
                <label>
                  <input
                    type="radio"
                    name="input"
                    value={d.deviceId}
                    onChange={() => {
                      onSelectInput(d.deviceId);
                    }}
                  />
                  {d.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div>output</div>
        <div>
          {outputs.map((d) => {
            return (
              <div key={d.deviceId}>
                <label>
                  <input
                    type="radio"
                    name="output"
                    value={d.deviceId}
                    onChange={() => {
                      onSelectOutupt(d.deviceId);
                    }}
                  />
                  {d.label}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const App = () => {
  const [input, setInput] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async () => {
      setDevices(await getAudioDevices());
    })();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <DeviceSelector
          devices={devices}
          onSelectInput={setInput}
          onSelectOutupt={setOutput}
        />
        <div>
          <button
            disabled={!input}
            onClick={async () => {
              if (!input) return;
              const canvasElement = canvasRef.current;
              const canvasElement2 = canvasRef2.current;
              if (!canvasElement || !canvasElement2) return;
              const context = createAudioContext();
              const stream = await createAudioStream(context, input);
              const cleanup = runWaveAnalyser(context, stream, canvasElement);
              const cleanup2 = runFrequencyAnalyser(context, stream, canvasElement2);
            }}
          >
            start
          </button>
        </div>
      </div>
      <div>
        <canvas ref={canvasRef} width={400} height={300} />
        <canvas ref={canvasRef2} width={400} height={300} />
      </div>
    </div>
  );
};
