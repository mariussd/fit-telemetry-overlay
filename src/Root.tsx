import {Composition, OffthreadVideo, staticFile} from 'remotion'
import Overlay from './compositions/Overlay'
import {FPS, HEIGHT, WIDTH} from './config'
import useFitData from './fit-utils/useFitData'
import videoJson from '../public/DJI_20240920095433_0108_D.json'

export const timeToSeconds = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return ((hours) * 3600) + (minutes * 60) + seconds;
};

console.log({videoJson})
const videoInfo = videoJson[0]



export default function RemotionRoot() {

  // const fitData = useFitData()
  // const totalDurationInSeconds = fitData.features[fitData.features.length - 1]?.properties.elapsed_time ?? 1

  console.log({duration: videoInfo.Duration, framerate: videoInfo.VideoFrameRate, calc: timeToSeconds(videoInfo.Duration)})

  const totalDurationInSeconds = Math.floor(timeToSeconds(videoInfo.Duration) * videoInfo.VideoFrameRate)

  console.log({totalDurationInSeconds})

  return (
    <>
      <Composition
        id="Overlay"
        component={Overlay}
        durationInFrames={totalDurationInSeconds}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  )
}
