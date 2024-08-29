import * as d3 from 'd3'
import {Feature, FeatureCollection, LineString} from 'geojson'
import {COLORS} from '../config'

type Props = {
  featureCollection: FeatureCollection
  feature: Feature<LineString>
  distance: number
}

export default function MapSegment({featureCollection, feature, distance}: Props) {
  const width = 400
  const height = 1000

  const projection = d3.geoMercator()
    .fitSize([width, height], featureCollection)

  const [start, end] = feature.geometry.coordinates
  const mid: [number, number] = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
  const [x, y] = projection(mid) ?? [0, 0]

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      <g end={0} style={{transformOrigin: 'center top', transform: `scale(${.85}) translate(25%, 0)`}}>
        <path
          d={d3.geoPath(projection)({
            type: 'FeatureCollection',
            features: featureCollection.features,
          }) ?? undefined}
          strokeWidth={4}
          stroke={COLORS.BG}
        />
        <circle
          cx={x}
          cy={y}
          r={7}
          fill={COLORS.FG}
        />
      </g>
      <g
        transform={`translate(${width}, ${height - 42})`}
        textAnchor={'end'}
        fontVariant={'tabular-nums'}
        fontFamily={'SF Pro Rounded'}
        fill={COLORS.FG}
      >
        <text
          y={40}
          x={-62}
          fontSize={120}
          fontWeight={700}
          letterSpacing={'-0.04em'}
        >
          {distance.toFixed(1)}
        </text>
        <text
          y={40}
          fontSize={32}
          fontWeight={500}
        >
          km
        </text>
      </g>
    </svg>
  )
}
