import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FitData, FitProperties } from "../types";
import Speedometer from "../components/Speedometer";
import MapSegment from "../components/MapSegment";
import useFitData from "../fit-utils/useFitData";
import { HeartRate } from "../components/HeartRate";
import { COLORS } from "../config";

const PAD = 120;

export default function Overlay() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fitData = useFitData();

  const time = frame / fps;

  const currentSecond = Math.floor(time);
  const nextSecond = currentSecond + 1;

  const currentFeature = fitData.features
    .filter((f) => f.properties.elapsed_time <= currentSecond)
    .slice(-1)[0];
  const nextFeature = fitData.features.filter(
    (f) => f.properties.elapsed_time > currentSecond
  )[0];

  const dataReady = currentFeature && nextFeature;

  const inputRange = [currentSecond, nextSecond];

  const timeStamp = currentFeature?.properties.timestamp;
  const timeOfDay = timeStamp?.toTimeString().slice(0, 5);
  const date = timeStamp?.toLocaleDateString("en-gb");

  const avgSpeed = rollingAvg(fitData, "speed", currentSecond, 3);
  const nextAvgSpeed = rollingAvg(fitData, "speed", nextSecond, 3);

  const distance =
    (currentFeature?.properties.distance || nextFeature?.properties.distance) ??
    0;
  const speed = interpolate(time, inputRange, [avgSpeed, nextAvgSpeed]);

  return (
    <AbsoluteFill>
      {/* <OffthreadVideo src={staticFile("video.mp4")} /> */}
      {dataReady && (
        <>
          <div
            style={{
              position: "absolute",
              padding: PAD,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "Helvetica",
              color: COLORS.FG,
            }}
          >
            <span style={{ fontSize: 150 }}>{timeOfDay}</span>
            <span style={{ fontSize: 80 }}>{date}</span>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: PAD,
              left: PAD,
              minWidth: 1000,
              display: "flex",
              alignItems: "end",
              gap: 40,
            }}
          >
            <Speedometer speed={speed} maxSpeed={60} />
            <HeartRate heartRate={currentFeature.properties.heart_rate} />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: PAD,
              right: PAD,
              minWidth: 1000,
              height: 1000,
            }}
          >
            <MapSegment
              featureCollection={fitData}
              feature={currentFeature}
              distance={distance}
            />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
}

function rollingAvg(
  data: FitData,
  field: keyof FitProperties,
  second: number,
  window: number
): number {
  const dataInRange = data.features.filter(
    (f) =>
      f.properties.elapsed_time > second - window &&
      f.properties.elapsed_time <= second
  );

  if (dataInRange.length === 0) {
    return 0;
  }

  const sum = dataInRange.reduce((acc, f) => {
    if (typeof f.properties[field] === "number") {
      return acc + f.properties[field];
    }

    return acc;
  }, 0);

  return sum / dataInRange.length;
}
