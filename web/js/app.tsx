import { useEffect, useState } from "react";
import { getAudioDevices, startSynth } from "./audio";

const DeviceSelector = ({ devices }: { devices: MediaDeviceInfo[] }) => {
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
                  <input type="radio" name="input" />
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
                  <input type="radio" name="output" />
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
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    (async () => {
      setDevices(await getAudioDevices());
    })();
  }, []);

  return (
    <div>
      <DeviceSelector devices={devices} />
      <div>
        <button onClick={startSynth}>start</button>
      </div>
    </div>
  );
};
