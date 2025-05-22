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
import videoJson from '../../public/DJI_20240920095433_0108_D.json'
import { calculateStartedDate, convertAndAddTwoHours } from "../utils/utils";
import { useMemo } from "react";
import { timeToSeconds } from "../Root";

const PAD = 120;

const videoInfo = videoJson[0]

console.log({
  created: videoInfo.MediaCreateDate, 
  duration: videoInfo.Duration, 
  start: calculateStartedDate(videoInfo.MediaCreateDate, videoInfo.Duration)?.toLocaleString() 
})

function areDatesWithinOneSecond(date1: Date, date2: Date): boolean {
  const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
  return diffInMilliseconds <= 1000;
}

function getSecondsBetweenDates(date1: Date, date2: Date): number {
  const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
  return diffInMilliseconds / 1000;
}

export default function Overlay() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fitData = useFitData();

  const startedTime = calculateStartedDate(videoInfo.FileModifyDate.slice(0, 19), videoInfo.Duration)

  if (!startedTime) {
    return null
  }

  startedTime.setSeconds(startedTime.getSeconds() + 4)

  const relevantFitData = useMemo(() => {
    const firstFeature = fitData.features.find((feature) => {
      return areDatesWithinOneSecond(feature.properties.timestamp, startedTime)
    })

    const endedTime = convertAndAddTwoHours(videoInfo.FileModifyDate.slice(0, 19))

    if (!endedTime) return []

    const lastFeature = fitData.features.find((feature) => {
      return areDatesWithinOneSecond(feature.properties.timestamp, endedTime)
    })

    if (!firstFeature) return []
    if (!lastFeature) return []

    const firstIndex = fitData.features.indexOf(firstFeature)
    const lastIndex = fitData.features.indexOf(lastFeature)

    return fitData.features.slice(firstIndex, lastIndex + 1)
  }, [fitData]);

  console.log({relevantFitData})

  if (!relevantFitData.length) return null

  if (!fitData.features.length) return null

  const time = frame / fps;

  const currentSecond = Math.floor(time);
  const nextSecond = currentSecond + 1;

  console.log({currentSecond})

  console.log({firstFeature: fitData.features[0], fitData})

  const fitDataStartTime = fitData.features[0].properties.timestamp;
  
  const elapsedTimeDifference = relevantFitData[0].properties.elapsed_time

  console.log({elapsedTimeDifference, start: fitDataStartTime.toISOString()})

  const currentFeature = relevantFitData.filter(
    (f) => f.properties.elapsed_time - elapsedTimeDifference <= currentSecond
  ).slice(-1)[0]

  if (!currentFeature) return null

  const nextFeature = relevantFitData[relevantFitData.indexOf(currentFeature) + 1]

  // Må ta i betraktning at videoen ikke starter ved midnatt
  // Finne en måte å sammenligne elapsed time og currentSecond på
  // siden jeg ikke starter videoen når elapsed_time er 0

  // Tiden fra økten startet til filmen begynner

  console.log({currentFeature, nextFeature})

  const dataReady = currentFeature && nextFeature;

  const inputRange = [currentSecond, nextSecond];

  const timeStamp = currentFeature?.properties.timestamp;
  const timeOfDay = timeStamp?.toTimeString().slice(0, 5);
  const date = timeStamp?.toLocaleDateString("en-gb");

  const avgSpeed = rollingAvg(fitData, "speed", currentSecond + elapsedTimeDifference, 3);
  const nextAvgSpeed = rollingAvg(fitData, "speed", nextSecond + elapsedTimeDifference, 3);

  const distance =
    (currentFeature?.properties.distance || nextFeature?.properties.distance) ??
    0;
  const speed = interpolate(time, inputRange, [avgSpeed, nextAvgSpeed]);

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <OffthreadVideo src={staticFile("DJI_20240920095433_0108_D.mp4")} />
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
