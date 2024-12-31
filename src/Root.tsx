import {Composition, OffthreadVideo, staticFile} from 'remotion'
import Overlay from './compositions/Overlay'
import {FPS, HEIGHT, WIDTH} from './config'
import useFitData from './fit-utils/useFitData'

export default function RemotionRoot() {

  const fitData = useFitData()
  const totalDurationInSeconds = fitData.features[fitData.features.length - 1]?.properties.elapsed_time ?? 1

  return (
    <>
      <Composition
        id="Overlay"
        component={Overlay}
        durationInFrames={totalDurationInSeconds * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  )
}
