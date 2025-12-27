import { defineConfig } from '@vue/cli-service'

export default defineConfig({
  // 需要通过 Babel 转译的依赖包
  transpileDependencies: true,
  // 开发服务器配置
  devServer: {
    port: 8080,
    open: false, // 自动打开浏览器
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   },
    // },
  },
  // 生产环境配置
  productionSourceMap: true,
  // CSS 相关配置
  css: {
    // 是否使用 CSS source map
    sourceMap: true,
  },

  // Webpack 配置
  configureWebpack: {
    // 自定义 webpack 配置
  },

  // 链式配置
  chainWebpack: _config => {
    // 自定义 webpack 链式配置
    // 例如:添加别名、修改 loader 等
  },
})
