import { ConnectedRouter } from 'connected-react-router'
import { History } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'
import Router from 'Router'
import { IGlobalState } from 'redux/store'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import deepOrange from '@material-ui/core/colors/deepOrange'
import CssBaseline from '@material-ui/core/CssBaseline'


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
			<ConnectedRouter history={props.history}>
                <Router />
			</ConnectedRouter>
		</MuiThemeProvider>
	</Provider>
)
