import express from 'express'
import bodyParser from 'body-parser'
import engines from 'consolidate'
import morgan from 'morgan'
import path from 'path'
import compression from 'compression'
import bugsnag from '@bugsnag/js'
import bugsnagExpress from '@bugsnag/plugin-express'

import passport from 'passport'

import './config/passport'

import routes from './routes'
import HTTPError from './util/HTTPError'

const app = express()

const bugsnagClient = bugsnag(process.env.BUGSNAG_API_KEY)
bugsnagClient.use(bugsnagExpress)
const bugsnagMW = bugsnagClient.getPlugin('express')

// app.use(bugsnagMW.requestHandler) // this must be the first `app.use` or bugsnag will miss some errors

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    next()
}

//
// middleware
//

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
app.use(morgan('dev'))
app.use(allowCrossDomain)

app.use('/static', express.static(`${__dirname}/public`))
// app.set('views', `${__dirname}/views`)
// app.engine('html', engines.mustache)
// app.set('view engine', 'html')

app.use(passport.initialize())

//
// routes
//

app.use('/', routes)

const isDeveloping = process.env.NODE_ENV !== 'production'
// if (isDeveloping) {
//     console.log('Development mode enabled')
//     require('./app.development.js')(app)
// } else {
// in production, force client to use HTTPS via redirect
// app.use((req, res, next) => {
//     if (!req.secure && req.get('X-Forwarded-Proto') !== 'https') {
//         res.redirect('https://' + req.get('Host') + req.url)
//     } else {
//         next()
//     }
// })

app.use(compression())
app.use(express.static(path.join(__dirname, '../dist/public')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'))
})
// }

// error handler
app.use((err, req, res, next) => {
    // if (isDeveloping) {
    console.error(err)
    // }

    if (err.statusCode) {
        res.status(err.statusCode).json({ error: err.message })
    } else {
        bugsnagClient.notify(err)
        res.status(500).json({ error: `Unhandled error: ${err.toString()}` })
    }
})

// not currently using bugsnag's built-in error handler
// app.use(bugsnagMW.errorHandler) // this must be the last `app.use`

export default app
