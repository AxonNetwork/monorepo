import 'dotenv/config' // Allow webpack config file to use .env variables

import path from 'path'
import webpack from 'webpack'

import cssnano from 'cssnano'
import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'

import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import DotenvPlugin from 'dotenv-webpack'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ProgressBarWebpackPlugin from 'progress-bar-webpack-plugin'

const ReactManifest = path.join(__dirname, 'dist-bundle/dll/react_manifest.json')
const ImmutableManifest = path.join(__dirname, 'dist-bundle/dll/immutable_manifest.json')
const devMode = process.env.NODE_ENV !== 'production'

const PACKAGE = require('../package.json')

const appVersion = PACKAGE.version // grabs the version number from package.json

export default {
    // The base directory, an absolute path, for resolving entry points and loaders from configuration
    context: path.resolve(__dirname),

    // Get mode from NODE_ENV
    mode: process.env.NODE_ENV,

    // Determine how the different types of modules within a project will be treated
    module: {
        rules: [
            // Use awesome-typescript-loader and babel-loader for ts(x) files
            {
                test: /\.tsx?$/,
                use:  [
                    { loader: 'babel-loader' },
                    // Use those two flags to speed up babel compilation
                    // https://github.com/s-panferov/awesome-typescript-loader#differences-between-ts-loader
                    {
                        loader:  'awesome-typescript-loader',
                        options: {
                            useBabel:    true,
                            useCache:    true,
                            silent:      true,
                            reportFiles: [
                                'src/**/*.{ts,tsx}',
                                '../../conscience-lib/**/*.{ts,tsx}',
                                '../../conscience-components/**/*.{ts,tsx}',
                            ],
                        },
                    },
                    // Alternatively, we can use ts-loader
                    // { loader: 'ts-loader' },
                ],
            },
            // Use a list of loaders to load prism css files
            {
                test: /\.css$/,
                use:  [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader:  'css-loader',
                        options: {
                            sourceMap:     !devMode,
                            importLoaders: 1,
                        },
                    }, // TODO: enable sourceMap in devMode without FOUC
                    {
                        loader:  'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins:   () => [ postcssImport, postcssPresetEnv, cssnano ],
                        },
                    },
                ],
            },
            // Use a list of loaders to load scss files
            {
                test: /\.scss$/,
                use:  [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader:  'css-loader',
                        options: {
                            sourceMap:      !devMode,
                            importLoaders:  2,
                            modules:        true,
                            localIdentName: '[local]--[hash:base64:8]',
                        },
                    }, // TODO: enable sourceMap in devMode without FOUC
                    {
                        loader:  'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins:   () => [ postcssImport, postcssPresetEnv, cssnano ],
                        },
                    },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                ],
            },
            // Use a list of loaders to load less files
            {
                test: /\.less$/,
                use:  [ { loader: 'style-loader', // creates style nodes from JS strings
                }, { loader: 'css-loader', // translates CSS into CommonJS
                }, { loader: 'less-loader', // compiles Less to CSS
                } ],
            },
            // Use image-webpack-loader and url-loader to load images
            {
                test: /\.(png|jpe?g|gif|svg|webp|tiff)(\?.*)?$/,
                use:  [
                    { loader: 'url-loader', options: { limit: 10000, name: '[name].[hash:7].[ext]' } },
                    { loader: 'image-webpack-loader', options: { disable: devMode } },
                ],
            },
            // Use url-loader to load font related files
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use:  [
                    { loader: 'url-loader', options: { limit: 10000, name: '[name].[hash:7].[ext]' } },
                ],
            },
            // Use url-loader to load audio related files
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use:  [
                    { loader: 'url-loader', options: { limit: 10000, name: '[name].[hash:7].[ext]' } },
                ],
            },
        ],
    },

    // A list of used webpack plugins
    plugins: [
        new webpack.DefinePlugin({ 'process.env.APP_VERSION': JSON.stringify(require('../package.json').version) }),
        // Enforces case sensitive paths.
        new CaseSensitivePathsPlugin(),
        // Supports dotenv file
        // new DotenvPlugin(),
        // Warns when multiple versions of the same package exist in a build
        new DuplicatePackageCheckerPlugin(),
        // Load pre-build dll reference files
        new webpack.DllReferencePlugin({ manifest: ReactManifest }),
        new webpack.DllReferencePlugin({ manifest: ImmutableManifest }),
        // Extract css part from javascript bundle into separated file
        new MiniCssExtractPlugin({
            filename:      '[name].[contenthash:10].css',
            chunkFilename: '[name].[contenthash:10].css',
        }),
        // Better building progress display
        new ProgressBarWebpackPlugin(),
        // Generate html file to dist folder
        new HtmlWebpackPlugin({
            title:    'Conscience',
            template: path.resolve(__dirname, 'public/index.ejs'),
        }),
        // Add dll reference files to html
        new AddAssetHtmlPlugin({
            filepath:         path.resolve(__dirname, 'dist-bundle/dll/*_dll.js'),
            includeSourcemap: false,
        }),
        // Copy static files to build dir
        new CopyWebpackPlugin([
            {
                from:   'public/**/*',
                to:     '[name].[ext]',
                ignore: [ 'index.ejs' ],
            },
            {
                from: '../../conscience-lib/rpc/noderpc.proto',
                to:   'noderpc.proto',
            },
        ]),
    ],

    // Change how modules are resolved
    resolve: {
    // What directories should be searched when resolving modules
        modules: [
            'node_modules',
            'src',
        ],
        // Automatically resolve certain extensions (Ex. import 'folder/name(.ext)')
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.css',
            '.scss',
        ],
    },
    externals: [ 'grpc' ],
    node:      {
        __dirname:  false,
        __filename: false,
    },
}
