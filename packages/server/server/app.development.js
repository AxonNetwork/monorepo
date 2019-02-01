import path from 'path'
import webpack from 'webpack'
import webpackMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './../webpack.config'

const compiler = webpack(webpackConfig)

const middleware = webpackMiddleware(compiler, {
    publicPath:  webpackConfig.output.publicPath,
    contentBase: 'src',
    stats:       {
        colors:       true,
        hash:         false,
        timings:      true,
        chunks:       false,
        chunkModules: false,
        modules:      false,
    },
})
module.exports = function devApp(app) {
    app.use(middleware)
    app.use(webpackHotMiddleware(compiler))
    // app.get('*', (req, res) => {
    //     res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')))
    //     res.end()
    // })
}
