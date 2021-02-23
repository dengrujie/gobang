const path = require('path');
const {join}=path
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  output: {
    publicPath: './',
    path: join(__dirname, '../dist'),
  },
  //webpack5的splitechunk只能在生成环境中使用
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true
      }),
    ],
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      chunks: 'async',
      minChunks: 1,
      maxAsyncRequests: 5,
      // maxSize: 300000,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5,
          // minSize: 0,
          name: 'commons',
        },
      },
      //最小的文件大小 超过之后将不予打包
      minSize: {
        javascript: 100000,
        style: 100000,
      },
      //最大的文件 超过之后继续拆分
      maxSize: {
        javascript: 30000000, //故意写小的效果更明显
        style: 30000000,
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
          },
        ],
      },
      canPrint: true,
    }),
    new HtmlWebpackPlugin({
      title: '五子棋',
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true,
    }),
  ],
};
