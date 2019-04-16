import bugsnag from 'bugsnag-js'
import createPlugin from 'bugsnag-react'
import React from 'react'

const bugsnagClient = bugsnag({
    apiKey: 'ed03ac1c6d556ce28a3c4f8722150904',
})

// wrap your entire app tree in the ErrorBoundary provided
const ErrorBoundary = bugsnagClient.use(createPlugin(React))

export {
    bugsnagClient,
    ErrorBoundary,
}
