const merge = require('webpack-merge');
const { join, resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const argv = require('yargs-parser')(process.argv.slice(2));
const _mode = argv.mode || 'development';
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
const _modeflag = _mode == 'production' ? true : false;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const webpack = require('webpack');
//公共选项配置区域
let cssLoaders = [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
    },
  },
];
/**
 * @type {import('webpack').Configuration}
 */
const webpackBaseConfig = {
  entry: {
    app: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [resolve('src')],
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: cssLoaders,
      },
    ],
  },

  resolve: {
    // modules: ['node_modules', resolve('src')],
    extensions: ['.js', '.ts', '.tsx', 'jsx'],
  },
  plugins: [
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      filename: _modeflag
        ? 'styles/[name].[contenthash:5].css'
        : 'styles/[name].css',
      chunkFilename: _modeflag
        ? 'styles/[id].[contenthash:5].css'
        : 'styles/[id].css',
      ignoreOrder: true,
    }),
  ],
};
module.exports = merge.default(webpackBaseConfig, _mergeConfig);
