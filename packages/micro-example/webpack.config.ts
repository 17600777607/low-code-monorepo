import path from 'path'
import { fileURLToPath } from 'url'
import type { Configuration as WebpackConfiguration } from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import webpack from 'webpack'

const { container, DefinePlugin } = webpack
const { ModuleFederationPlugin } = container

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface Configuration extends WebpackConfiguration {
  devServer?: DevServerConfiguration
}

const config: Configuration = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
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
        use: ['vue-style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'Micro Example App',
    }),
    new ModuleFederationPlugin({
      name: 'micro_example',
      filename: 'remoteEntry.js',
      exposes: {
        './MicroApp': './src/App.vue',
        './HelloWorld': './src/components/HelloWorld.vue',
      },
      shared: {
        vue: {
          singleton: true,
          requiredVersion: '^3.2.13',
        },
      },
    }),
  ],
  devServer: {
    port: 3001,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
}

export default config
