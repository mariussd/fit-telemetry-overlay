// @ts-ignore
import EasyFit from "easy-fit";
import { FitData } from "../types";

function isNonZeroFloat(value: any) {
  return (
    typeof value === "number" && !isNaN(value) && value !== 0 && value % 1 !== 0
  );
}

function createCoordinates(
  startLong: number,
  startLat: number,
  endLong: number,
  endLat: number
) {
  const long = [startLong, endLong].filter(value => isNonZeroFloat(value));
  const lat = [startLat, endLat].filter(value => isNonZeroFloat(value))

  if (!lat.length && !long.length) {
    return;
  }

  return [
    [long[0], lat[0]],
    [long[long.length - 1], lat[lat.length - 1]],
  ];
}

const easyFit = new EasyFit({
  force: true,
  speedUnit: "km/h",
  lengthUnit: "km",
  elapsedRecordField: true,
  mode: "both",
});

export async function parseFitFile(file: ArrayBuffer): Promise<FitData> {
  return new Promise((resolve, reject) => {
    easyFit.parse(file, (error: any, data: any) => {
      if (error) {
        console.log(error);
        reject(error);
      }

      resolve(transformToFitData(data));
    });
  });
}

function transformToFitData(data: any) {
  const geo: FitData = {
    type: "FeatureCollection",
    features: [],
  };

  if (data && data.records) {
    let prev_position_long = 0;
    let prev_position_lat = 0;
    let idx_records = 0;
    let element: any = {};
    let pausedTime = 0;
    for (idx_records = 0; idx_records < data.records.length; idx_records++) {
      element = data.records[idx_records];

      if (!element.speed) {
        pausedTime += 1;
        continue;
      }

      if (idx_records < 10) {
        console.log({ long: element.position_long, lat: element.position_lat });
      }

      const coordinates = createCoordinates(
        prev_position_long,
        prev_position_lat,
        element.position_long,
        element.position_lat
      );

      if (!coordinates) {
        continue;
      }

      if (idx_records > 0) {
        let f: any = {};
        f.type = "Feature";
        f.properties = {
          ...element,
          elapsed_time: element.elapsed_time - pausedTime,
        };
        f.geometry = {};
        f.geometry.type = "LineString";
        f.geometry.coordinates = coordinates,
      
        geo.features.push(f);
      }
      prev_position_long = element.position_long;
      prev_position_lat = element.position_lat;
    }
  }

  return geo;
}
