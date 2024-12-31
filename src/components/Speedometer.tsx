import * as d3 from 'd3'
import {COLORS} from '../config'

type Props = {
  speed: number
  maxSpeed: number
}

export default function Speedometer({speed, maxSpeed}: Props) {
  console.log({speed, maxSpeed})
  const width = 400
  const height = 400

  const outerRadius = height / 2 - 24
  const innerRadius = outerRadius

  const cappedSpeed = Math.min(speed, maxSpeed)
  const percentage = cappedSpeed / maxSpeed

  const opacity = Math.min(speed, 1)

  return (
    <svg viewBox={`0 0 ${width} ${height - 54}`}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        <path
          d={d3.arc()({innerRadius, outerRadius, startAngle: 0, endAngle: rad(260)}) ?? undefined}
          transform={`rotate(${-130})`}
          strokeWidth={24}
          stroke={COLORS.BG}
          strokeLinejoin={'round'}
        />
        <path
          d={d3.arc()({innerRadius, outerRadius, startAngle: 0, endAngle: rad(260) * percentage}) ?? undefined}
          transform={`rotate(${-130})`}
          strokeWidth={24}
          stroke={COLORS.FG}
          strokeLinejoin={'round'}
          opacity={opacity}
        />
      </g>
      <g
        transform={`translate(${width / 2}, ${height / 2})`}
        textAnchor={'middle'}
        fontVariant={'tabular-nums'}
        fontFamily={'SF Pro Rounded'}
        fill={COLORS.FG}
      >
        <text
          y={40}
          fontSize={140}
          fontWeight={700}
          letterSpacing={'-0.04em'}
        >
          {speed.toFixed(0)}
        </text>
        <text
          y={92}
          fontSize={36}
          fontWeight={500}
        >
          km/h
        </text>
      </g>
    </svg>
  )
}

function rad(degrees: number) {
  return degrees * Math.PI / 180
}