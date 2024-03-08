const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader')

module.exports = (env = {}) => ({
  mode: env.prod ? 'production' : 'development',
  devtool: env.prod ? 'source-map' : '',
  entry: path.resolve(__dirname, './src/main.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 8080,
    historyApiFallback: true, // without no routing
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules')],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'vue': '@vue/runtime-dom' // これがないとvue-compilerがVueファイルを認識しません
    },
    extensions: ['.vue', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: [/\.vue$/],
        loader: 'vue-loader',
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { hmr: !env.prod }
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: { indentedSyntax: true }
            }
          }
        ]
      },
      {
        test: [/\.ts$/, /\.tsx$/],
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/] // これがないとTSファイル内でVueファイルを読み込めません
            }
          }
        ]
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(), // VueLoaderPluginがVue3用に必要です
    new HtmlWebpackPlugin({
      publicPath: 'dist',
      filename: 'index.html',
      template: 'src/html/index.html',
    }),
    new MiniCssExtractPlugin({
      publicPath: 'dist',
      filename: '[name].css',
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false'
    })
  ],
})
