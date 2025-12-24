import path from 'path'
import { fileURLToPath } from 'url'
import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import WebpackBar from 'webpackbar'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import webpack from 'webpack'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

const { container, DefinePlugin } = webpack
const { ModuleFederationPlugin } = container

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Configuration extends WebpackConfiguration {
  devServer?: DevServerConfiguration
}
type Env = 'development' | 'production' | 'preview'
export default (
  env: { APP_ENV?: Env } = {},
  argv: { mode?: Configuration['mode'] } = {}
): Configuration => {
  const envTarget = (env.APP_ENV || 'development') as Env
  process.stdout.write(`env.APP_ENV: ${envTarget}\n`)
  process.stdout.write(`argv.mode: ${argv.mode}\n`)

  const mode = argv.mode || 'development'
  const isProd = mode === 'production'

  // 加载环境变量
  const envFile = `.env.${envTarget}`

  const envConfig = dotenv.config({ path: path.resolve(__dirname, envFile) })
  dotenvExpand.expand(envConfig)

  return {
    mode,
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'public/apps/ROOT'),
      filename: 'js/[name].[contenthash].js',
      assetModuleFilename: 'assets/[name].[hash][ext]',
      clean: true,
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            babelParserPlugins: ['jsx', 'typescript'],
          },
        },
        // 处理 .vue 文件中的 TypeScript
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: [
              ['@babel/preset-env', { targets: { esmodules: true } }],
              ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
            ],
          },
        },
        // 处理普通 JavaScript 和从 Vue 编译出来的代码
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: [
              ['@babel/preset-env', { targets: { esmodules: true } }],
              [
                '@babel/preset-typescript',
                { allExtensions: true, isTSX: false, onlyRemoveTypeImports: true },
              ],
            ],
          },
        },
        {
          test: /\.css$/,
          use: [isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    stats: 'errors-warnings',
    plugins: [
      new WebpackBar({
        name: '主应用',
        color: '#667eea',
      }),
      new VueLoaderPlugin(),
      new DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash].css',
              chunkFilename: 'css/[id].[contenthash].css',
            }),
          ]
        : []),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        title: 'Vue3 Webpack Micro Frontend',
      }),
    ],
    devServer: {
      port: 3000,
      hot: true,
      open: false,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: [
        // {
        //   context: ['/micro-app'],
        //   target: process.env.MICRO_EXAMPLE_DEV_SERVER,
        //   changeOrigin: true,
        // },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      minimizer: [`...`, new CssMinimizerPlugin()],
    },
  }
}
