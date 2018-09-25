import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import Login from './components/Login/LoginPage'
import MainUI from './components/MainUI'
import SharedReposDialog from './components/SharedReposDialog/SharedReposDialog'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import deepOrange from '@material-ui/core/colors/deepOrange'
import grey from '@material-ui/core/colors/grey'
import CssBaseline from '@material-ui/core/CssBaseline'

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
    status: {
        danger: 'orange',
    },
})

class App extends Component
{
    render() {
        const { store, userLoggedIn } = this.props

        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    {!userLoggedIn &&
                        <Login />
                    }
                    {userLoggedIn &&
                        <React.Fragment>
                            <MainUI />
                            <SharedReposDialog />
                        </React.Fragment>
                    }
                </MuiThemeProvider>
            </Provider>
        )
    }
}

App.propTypes = {
    userLoggedIn: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    const userLoggedIn = state.user.jwt !== undefined && state.user.jwt.length > 0
    return {
        userLoggedIn: userLoggedIn,
    }
}

const mapDispatchToProps = {

}

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)

export default AppContainer
