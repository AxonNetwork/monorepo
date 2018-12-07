import bugsnag from 'bugsnag-js'
import createPlugin from 'bugsnag-react'
import React from 'react'

const bugsnagClient = bugsnag({
    apiKey: '56c4ea30a2f2eff4e1426939c89cb0e6',
    appVersion: process.env.APP_VERSION,
})

// wrap your entire app tree in the ErrorBoundary provided
const ErrorBoundary = bugsnagClient.use(createPlugin(React))

export {
    bugsnagClient,
    ErrorBoundary,
}
