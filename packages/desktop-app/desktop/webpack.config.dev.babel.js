import path from 'path'
import merge from 'webpack-merge'
import Dotenv from 'dotenv-webpack'
import BaseWebpackConfig from './webpack.config.base.babel'

export default merge(BaseWebpackConfig, {
    // The point or points to enter the application.
    entry: {
        app: [
            './src/index',
            require.resolve('./polyfills.js'),
        ],
    },

    // Affecting the output of the compilation
    output: {
    // path: the output directory as an absolute path (required)
        path:          path.resolve(__dirname, 'dist-bundle/dev'),
        // filename: specifies the name of entry output file (required)
        filename:      '[name].[hash:10].js',
        // chunkFilename: specifies the name of non-entry output files (e.g. dynamic import component)
        chunkFilename: '[name].[hash:10].js',
        publicPath:    '/',
    },

    devServer: {
    // Port number for webpack dev server
        port:  process.env.PORT_WEBPACK_DEV_SERVER || 3004,
        // Add proxy for api call
        proxy: {
            '/api/v1': {
                target: `http://localhost:${process.env.PORT || 3003}/`,
                secure: false,
            },
        },
        // Automatically open page
        open:               false,
        // Served index.html (contains 404 page in react-router) in place of any 404 responses
        historyApiFallback: {
            // rewrite all requests to "/" to prevent errors when trying to load URLs with file extensions
            rewrites: [
                {
                    from: /.*/,
                    to() {
                        return '/'
                    },
                },
            ],
        },
        watchOptions: { ignored: /node_modules/ },
    },

    // Source map mode
    // https://webpack.js.org/configuration/devtool
    devtool: 'eval-source-map',
    target:  'electron-renderer',

    plugins: [
        new Dotenv({ path: path.join(__dirname, '..', '.env') }),
    ],
})
