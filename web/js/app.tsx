import { useEffect, useRef, useState } from "react";
import {
  createAudioContext,
  getAudioDevices,
  createAudioStream,
  runAnalyser,
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
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;

  const [input, setInput] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
              if (!canvasElement) return;
              const canvasContext = canvasElement.getContext("2d")!;
              const context = createAudioContext();
              const stream = await createAudioStream(context, input);
              const cleanup = runAnalyser(context, stream, {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                context: canvasContext,
              });
            }}
          >
            start
          </button>
        </div>
      </div>
      <div>
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      </div>
    </div>
  );
};
