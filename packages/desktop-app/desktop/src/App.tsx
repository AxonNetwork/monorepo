import React from 'react'
import { Store } from 'redux'
import { Provider } from 'react-redux'
import MainUI from './components/MainUI'
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
    store: Store
    history: History
}

export default (props: IAppProps) => (
    <Provider store={props.store}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <MainUI />
        </MuiThemeProvider>
    </Provider>
)

