import React from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import { History } from 'history'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import { IGlobalState } from 'conscience-components/redux'
import MainUI from 'components/MainUI'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import deepOrange from '@material-ui/core/colors/deepOrange'
import grey from '@material-ui/core/colors/grey'
import CssBaseline from '@material-ui/core/CssBaseline'
import './assets/css/App.css'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: grey[900],
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
            <ConnectedRouter history={props.history}>
                <Switch>
                    <Route component={MainUI} />
                </Switch>
            </ConnectedRouter>
        </MuiThemeProvider>
    </Provider>
)

