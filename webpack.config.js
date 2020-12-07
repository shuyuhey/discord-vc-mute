const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const contextPath = path.join(__dirname, 'src')
const outputPath = path.join(__dirname, 'dist')

const main = {
  target: 'electron-main',
  context: contextPath,
  entry: './main/index.ts',
  output: {
    filename: 'main.js',
    path: outputPath,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  }
};

const renderer = {
  target: 'electron-renderer',
  context: contextPath,
  entry: './renderer/index.tsx',
  output: {
    filename: 'renderer.[contenthash].js',
    path: outputPath,
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
      template: './renderer/index.html'
    }),
  ]
}

module.exports = [main, renderer];
