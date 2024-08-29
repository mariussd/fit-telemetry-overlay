// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs
// All configuration options: https://remotion.dev/docs/config

import {Config} from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setPixelFormat('yuv420p')
Config.setCodec('h264')
Config.setMuted(true)

Config.setJpegQuality(100)
// Config.setFrameRange([300, 699])