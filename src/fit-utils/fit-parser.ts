// @ts-ignore
import EasyFit from 'easy-fit'
import {FitData} from '../types'

const easyFit = new EasyFit({
  force: true,
  speedUnit: 'km/h',
  lengthUnit: 'km',
  elapsedRecordField: true,
  mode: 'both',
})

export async function parseFitFile(file: ArrayBuffer): Promise<FitData> {
  return new Promise((resolve, reject) => {
    easyFit.parse(file, (error: any, data: any) => {
      if (error) {
        console.log(error)
        reject(error)
      }

      resolve(transformToFitData(data))
    })
  })
}

function transformToFitData(data: any) {
  const geo: FitData = {
    type: 'FeatureCollection',
    features: [],
  }

  if (data && data.records) {
    let prev_position_long = 0
    let prev_position_lat = 0
    let idx_records = 0
    let element: any = {}
    let pausedTime = 0;
    for (
      idx_records = 0;
      idx_records < data.records.length;
      idx_records++
    ) {
      element = data.records[idx_records]

      if (!element.speed) {
        pausedTime += 1;
        continue;
      }

      if (!element.position_long || !element.position_lat) {
        continue;
      }

      if (idx_records > 0) {
        let f: any = {}
        f.type = 'Feature'
        f.properties = {...element, elapsed_time: element.elapsed_time - pausedTime}
        f.geometry = {}
        f.geometry.type = 'LineString'
        f.geometry.coordinates = [
          [prev_position_long, prev_position_lat],
          [element.position_long, element.position_lat],
        ]
        geo.features.push(f)
      }
      prev_position_long = element.position_long
      prev_position_lat = element.position_lat
    }
  }

  return geo
}
