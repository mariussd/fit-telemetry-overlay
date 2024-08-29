import {FeatureCollection, LineString} from 'geojson'

export type FitProperties = {
  timestamp: Date
  elapsed_time: number
  position_lat: number
  position_long: number
  distance: number
  accumulated_power: number
  enhanced_speed: number
  enhanced_altitude: number
  power: number
  heart_rate: number
  cadence: number
  left_right_balance: number | undefined
  left_torque_effectiveness: number
  right_torque_effectiveness: number
  left_pedal_smoothness: number
  right_pedal_smoothness: number
  fractional_cadence: number
  left_pco: number
  right_pco: number
  left_power_phase: number
  left_power_phase_peak: number
  right_power_phase: number
  right_power_phase_peak: number
}

export type FitData = FeatureCollection<LineString, FitProperties>