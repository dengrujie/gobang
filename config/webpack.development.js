const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const webpack = require('webpack');
module.exports = {
  output: {
    publicPath: '/',
    path: resolve(__dirname, '../dist'),
    filename: 'bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: join(__dirname, '../dist'),
    inline: true,
    hot: true,
    quiet: true,
    port: 8082,
    watchContentBase: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '五子棋',
      filename: 'index.html',
      template: resolve(__dirname, '../public/index.html'),
    }),
  ],
};
