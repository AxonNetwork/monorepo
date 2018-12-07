import path from 'path';
import merge from 'webpack-merge';

import BaseWebpackConfig from './webpack.config.base.babel';

export default merge(BaseWebpackConfig, {
  // The point or points to enter the application.
  entry: {
    app: [
      './src/index',
    ],
  },

  // Affecting the output of the compilation
  output: {
    // path: the output directory as an absolute path (required)
    path: path.resolve(__dirname, 'dist/dev'),
    // filename: specifies the name of entry output file (required)
    filename: '[name].[hash:10].js',
    // chunkFilename: specifies the name of non-entry output files (e.g. dynamic import component)
    chunkFilename: '[name].[hash:10].js',
    publicPath: '/'
  },

  devServer: {
    // Port number for webpack dev server
    port: process.env.PORT_WEBPACK_DEV_SERVER || 3005,
    // Add proxy for api call
    proxy: {
      '/api/v1': {
        target: `http://localhost:${process.env.PORT || 3003}/`,
        secure: false,
      },
    },
    // Automatically open page
    open: true,
    // Served index.html (contains 404 page in react-router) in place of any 404 responses
    historyApiFallback: true,
  },

  // Source map mode
  // https://webpack.js.org/configuration/devtool
  devtool: 'eval-source-map',
});
