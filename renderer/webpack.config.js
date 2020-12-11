const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const contextPath = path.join(__dirname, 'src')
const outputPath = path.join(__dirname, '../app/dist')

const renderer = {
  target: 'electron-renderer',
  context: contextPath,
  entry: './index.tsx',
  output: {
    filename: 'renderer.js',
    path: outputPath,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 3035,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    }
  },
}

module.exports = [renderer];
