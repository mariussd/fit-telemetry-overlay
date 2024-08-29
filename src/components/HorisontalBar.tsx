import * as d3 from 'd3'
import {COLORS} from '../config'

type Props = {
  value: number
  maxValue: number
  unit: string
}

export default function HorisontalBar({value, maxValue, unit}: Props) {
  const width = 400
  const height = 400

  const cappedValue = Math.min(value, maxValue)
  const percentage = cappedValue / maxValue

  const lineWidth = 0.85 * width

  const opacity = Math.min(value, 1)

  return (
    <svg viewBox={`0 0 ${width} ${height / 2}`}>
      <g transform={`translate(${width / 2}, ${height / 3 + 40})`}>
        <path
          d={d3.line()([
            [-lineWidth / 2, 0],
            [lineWidth / 2, 0],
          ]) ?? undefined}
          strokeWidth={18}
          stroke={COLORS.BG}
          strokeLinecap={'round'}
        />
        <path
          d={d3.line()([
            [-lineWidth / 2, 0],
            [-lineWidth / 2 + lineWidth * percentage, 0],
          ]) ?? undefined}
          strokeWidth={18}
          stroke={COLORS.FG}
          strokeLinecap={'round'}
          opacity={opacity}
        />
      </g>
      <g
        transform={`translate(${width / 2}, ${height / 3})`}
        fontVariant={'tabular-nums'}
        fontFamily={'SF Pro Rounded'}
        fill={COLORS.FG}
      >
        <text
          textAnchor={'start'}
          x={-width * .9 / 2}
          fontSize={120}
          fontWeight={700}
          letterSpacing={'-0.04em'}
        >
          {value.toFixed(0)}
        </text>
        <text
          textAnchor={'end'}
          x={width * .9 / 2}
          fontSize={36}
          fontWeight={500}
        >
          {unit}
        </text>
      </g>
    </svg>
  )
}
