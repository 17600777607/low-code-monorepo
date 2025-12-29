import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import consola from 'consola'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  consola.ready('Vite 配置加载中...', { mode })
  return {
    plugins: [
      vue(),
      // 支持 Vue JSX/TSX
      vueJsx(),
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
    // 配置路径别名
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'element-plus'],
    },
    // 开发服务器配置
    server: {
      port: 5173,
      host: true,
      cors: true, // 允许跨域
    },
    // 构建输出到 apps/root 目录
    build: {
      outDir: resolve(__dirname, './apps/root'),
      emptyOutDir: true, // 只清空 root 目录
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
      // 资源目录拆分
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
