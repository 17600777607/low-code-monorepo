import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import qiankun from 'vite-plugin-qiankun'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import consola from 'consola'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  consola.ready('[renderer] Vite 配置加载中...', { mode })
  // 获取 monorepo 根目录（当前目录向上两级）
  const rootDir = resolve(__dirname, '../..')

  return {
    plugins: [
      vue(),
      vueJsx(),
      // qiankun 子应用配置
      qiankun('renderer', {
        useDevMode: true,
      }),
      // Element Plus 按需导入
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: resolve(__dirname, 'src/types/auto-imports.d.ts'),
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: resolve(__dirname, 'src/types/components.d.ts'),
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
      // 产物分析 - 仅在终端输出,不生成文件
      visualizer({
        template: 'list', // 使用列表模式
        gzipSize: true, // 显示 gzip 压缩后的大小
        brotliSize: true, // 显示 brotli 压缩后的大小
        filename: 'stats.html', // 文件名(不会生成,因为使用 stdout)
        open: false, // 不自动打开浏览器
        projectRoot: process.cwd(), // 项目根目录
        emitFile: false, // 不生成文件,只输出到终端
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 5004, // 管理后台固定端口
      host: true,
      open: false, // 作为子应用，不自动打开
      cors: true, // 允许跨域
      origin: 'http://localhost:5004', // qiankun 需要明确的 origin
      proxy: {
        // '/api': {
        //   target: env.VITE_APP_BASE_API,
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, ''),
        // },
      },
    },
    build: {
      outDir: resolve(rootDir, 'apps/renderer'),
      emptyOutDir: true, // 只清空 admin 目录
      target: 'esnext',
      // 完整的 source map
      sourcemap: true,
      // CSS 和 JS 压缩
      minify: 'terser',
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
          assetFileNames: assetInfo => {
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
