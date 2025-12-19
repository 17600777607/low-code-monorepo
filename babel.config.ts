import type { TransformOptions } from '@babel/core'

const config: TransformOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-typescript',
  ],
}

export default config

