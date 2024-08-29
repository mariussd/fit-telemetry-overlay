import {continueRender, delayRender, getStaticFiles} from 'remotion'
import {useEffect, useState} from 'react'
import {FitData} from '../types'
import {parseFitFile} from './fit-parser'

const INITIAL_FIT_DATA: FitData = {
  type: 'FeatureCollection',
  features: [],
}

export default function useFitData() {
  const [handle] = useState(() => delayRender('Loading .fit-file data...'))

  const [fitData, setFitData] = useState<FitData>(INITIAL_FIT_DATA)

  useEffect(() => {
    getFitData().then((data) => {
      setFitData(data)
      continueRender(handle)
    })

    return () => {
      continueRender(handle)
    }
  }, [handle])

  return fitData
}

async function getFitData(): Promise<FitData> {
  const file = getStaticFiles().find((file) => file.name.toLocaleLowerCase().endsWith('.fit'))
  if (!file) {
    return INITIAL_FIT_DATA
  }

  const response = await fetch(file.src)
  const content = await response.arrayBuffer()
  return parseFitFile(content)
}