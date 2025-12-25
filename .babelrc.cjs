module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        modules: false, // 保留 ES modules,让 webpack 处理
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true, // 支持所有文件扩展名
        isTSX: true, // 支持 TSX
      },
    ],
  ],
  // 开发环境下保留模块名,便于调试
  env: {
    development: {
      plugins: [],
    },
    production: {
      plugins: [
        // 生产环境移除 console
        [
          'transform-remove-console',
          {
            exclude: ['error', 'warn'],
          },
        ],
      ],
    },
  },
}
