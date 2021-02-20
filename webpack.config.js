const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const contextPath = path.join(__dirname, 'src')
const outputPath = path.join(__dirname, 'build')

module.exports = {
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
  ]
};
