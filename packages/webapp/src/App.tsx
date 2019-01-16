import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { History } from 'history'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { IGlobalState } from 'redux/store'
import Routes from 'Routes'

import Typography from '@material-ui/core/Typography'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import deepOrange from '@material-ui/core/colors/deepOrange'
import CssBaseline from '@material-ui/core/CssBaseline'
import './assets/app.css'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#313133',
            light: '#484848',
            dark: '#000000',
        },
        secondary: {
            main: deepOrange[700],
            light: '#ff7d47',
            dark: '#ac0800',
        },
    },
})

interface IAppProps {
    store: Store<IGlobalState>
    history: History
}

export default (props: IAppProps) => (
    <Provider store={props.store}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Typography>
                <ConnectedRouter history={props.history}>
                    <Routes />
                </ConnectedRouter>
            </Typography>
        </MuiThemeProvider>
    </Provider>
)
