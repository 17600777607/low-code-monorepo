import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import federation from '@originjs/vite-plugin-federation'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  // 获取 monorepo 根目录（当前目录向上两级）
  const rootDir = resolve(__dirname, '../..')

  return {
    plugins: [
      vue(),
      vueJsx(),
      // 模块联邦配置 - 暴露账号中心应用
      federation({
        name: 'accountApp', // 远程模块名称
        filename: 'accountAppEntry.js', // 入口文件名
        exposes: {
          './App': './src/App.vue', // 暴露主应用组件
        },
        shared: ['vue', 'vue-router'], // 共享依赖
      }),
      // Gzip 压缩
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // 大于 10KB 才压缩
        deleteOriginFile: false,
      }),
      // Gzip 压缩
      viteCompression({
        verbose: true, // 输出压缩成功信息
        disable: false, // 是否禁用
        threshold: 10240, // 体积大于 10KB 的文件才压缩
        algorithm: 'gzip', // 压缩算法
        ext: '.gz', // 压缩文件扩展名
        deleteOriginFile: false, // 压缩后是否删除原文件
      }),
      // 产物分析 - 在终端输出
      visualizer({
        template: 'list', // 使用列表模式,在终端输出
        gzipSize: true, // 显示 gzip 压缩后的大小
        brotliSize: true, // 显示 brotli 压缩后的大小
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5001, // 账号中心固定端口
      host: true,
      open: false, // 作为远程模块，不自动打开
      cors: true, // 允许跨域
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: resolve(rootDir, 'apps/account'),
      emptyOutDir: true, // 只清空 account 目录
      target: 'esnext', // 模块联邦需要
      // 完整的 source map
      sourcemap: true,
      // CSS 和 JS 压缩
      minify: 'terser',
      cssCodeSplit: false, // 模块联邦建议关闭 CSS 代码分割
      terserOptions: {
        compress: {
          drop_console: true, // 删除 console
          drop_debugger: true, // 删除 debugger
        },
      },
      rollupOptions: {
        output: {
          // JS 文件输出到 js 目录
          entryFileNames: 'js/[name]-[hash].js',
          // chunk 文件输出到 js 目录
          chunkFileNames: 'js/[name]-[hash].js',
          // 静态资源输出到 assets 目录
          assetFileNames: (assetInfo) => {
            // CSS 文件输出到 css 目录
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/[name]-[hash].[ext]'
            }
            // 其他静态资源输出到 assets 目录
            return 'assets/[name]-[hash].[ext]'
          },
        },
      },
    },
  }
})
