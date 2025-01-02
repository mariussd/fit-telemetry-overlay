import * as d3 from "d3";
import { Feature, FeatureCollection, LineString } from "geojson";
import { COLORS } from "../config";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  featureCollection: FeatureCollection;
  feature: Feature<LineString>;
  distance: number;
};

export default function MapSegment({
  featureCollection,
  feature,
  distance,
}: Props) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const featureIndex = featureCollection.features.indexOf(feature);

  const time = frame / fps;
  const currentSecond = Math.floor(time);
  const nextSecond = currentSecond + 1;
  const inputRange = [currentSecond, nextSecond];

  const width = 70;
  const height = 70;

  const projection = d3.geoMercator().fitHeight(height * 15, featureCollection);

  const [start, end] = feature.geometry.coordinates;

  const path = d3.geoPath(projection)({
    type: "FeatureCollection",
    features: featureCollection.features,
  });

  const altitudeInMeters = (feature.properties?.enhanced_altitude - 1) * 1000;

  const xInterpolation = interpolate(time, inputRange, [start[0], end[0]]);
  const yInterpolation = interpolate(time, inputRange, [start[1], end[1]]);

  const [x, y] = projection([xInterpolation, yInterpolation]) ?? [0, 0];

  const r = height / 2 - 6;
  const textOffset = 2;

  return (
    <svg viewBox={`${x - width / 2} ${y - height / 2} ${width} ${height}`}>
      <defs>
        <clipPath id="circleViewBox">
          <circle cx={x} cy={y} r={r - 0.6} />
        </clipPath>
        <path
          id="textPath"
          d={`M ${x - r - textOffset},${y} 
          A ${r + textOffset},${r + textOffset} 0 1,1 ${x + r + textOffset},${y}
          A ${r + textOffset},${r + textOffset} 0 1,1 ${x - r - textOffset},${y}`}
          fill="none"
        />
      </defs>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill="none"
        stroke={COLORS.BG}
        strokeWidth={1.5}
      />
      <text fontSize="6" fill="black">
        <textPath href="#textPath" startOffset="30%">
          {distance.toFixed(1)} km
        </textPath>
        <textPath href="#textPath" startOffset="10%">
          ▲ {altitudeInMeters.toFixed(0)} m
        </textPath>
      </text>
      <g clipPath="url(#circleViewBox)">
        <path d={path ?? undefined} strokeWidth={0.8} stroke={COLORS.BG} />
        <path
          d={
            d3.geoPath(projection)({
              type: "FeatureCollection",
              features: featureCollection.features.slice(0, featureIndex),
            }) ?? undefined
          }
          strokeWidth={0.85}
          stroke={COLORS.FG}
        />
        <circle cx={x} cy={y} r={1.5} fill={COLORS.DOT} />
      </g>
      <g
        transform={`translate(${width}, ${height - 42})`}
        textAnchor={"end"}
        fontVariant={"tabular-nums"}
        fontFamily={"SF Pro Rounded"}
        fill={COLORS.FG}
      >
        <text
          y={40}
          x={-62}
          fontSize={120}
          fontWeight={700}
          letterSpacing={"-0.04em"}
        >
          {/*distance.toFixed(1)*/}
        </text>
        <text y={40} fontSize={32} fontWeight={500}>
          {/*km*/}
        </text>
      </g>
    </svg>
  );
}
