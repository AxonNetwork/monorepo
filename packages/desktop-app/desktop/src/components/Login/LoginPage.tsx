import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import logo from '../../assets/img/logo.png'

import { login, signup } from 'conscience-components/redux/user/userActions'
import { IGlobalState } from 'conscience-components/redux'
import { autobind } from 'conscience-lib/utils'


@autobind
class LoginPage extends React.Component<Props, State>
{
    state = {
        displaySignup: true,
        name: '',
        password: '',
        email: '',
    }

    _inputUsername: HTMLInputElement | null = null
    _inputName: HTMLInputElement | null = null
    _inputEmail: HTMLInputElement | null = null
    _inputPassword: HTMLInputElement | null = null

    toggleView(event: Event) {
        event.preventDefault()
        this.setState({
            displaySignup: !this.state.displaySignup,
        })
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const email = this._inputEmail !== null ? this._inputEmail.value : ''
        const password = this._inputPassword !== null ? this._inputPassword.value : ''

        if (this.state.displaySignup) {
            const name = this._inputName !== null ? this._inputName.value : ''
            const username = this._inputUsername !== null ? this._inputUsername.value : ''
            this.props.signup({ name, username, email, password })
        } else {
            this.props.login({ email, password })
        }
    }

    render() {
        const { error, classes } = this.props
        return (
            <div className={classes.loginContainer}>
                <div>
                    <img src={logo} alt="Axon Logo" />

                    <Typography className={classes.headline} variant="headline">
                        {this.state.displaySignup ? 'Signup' : 'Login'}
                    </Typography>
                    <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                        {this.state.displaySignup &&
                            <React.Fragment>
                                <TextField
                                    label="Username"
                                    defaultValue={this.props.nodeUsername || ''}
                                    inputRef={x => this._inputUsername = x}
                                    disabled={!!this.props.nodeUsername}
                                    className={classes.textField}
                                    error={!!error}
                                />
                                <TextField
                                    label="Full Name"
                                    inputRef={x => this._inputName = x}
                                    className={classes.textField}
                                    error={!!error}
                                />
                            </React.Fragment>
                        }
                        <TextField
                            label="Email"
                            inputRef={x => this._inputEmail = x}
                            className={classes.textField}
                            error={!!error}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            inputRef={x => this._inputPassword = x}
                            className={classes.textField}
                            error={!!error}
                        />
                        {error !== undefined &&
                            <FormHelperText error className={classes.errorMessage}>{error.toString()}</FormHelperText>
                        }
                        <Button
                            variant="raised"
                            color="secondary"
                            className={classes.button}
                            disabled={this.props.loginLoading}
                            type="submit"
                        >
                            {this.state.displaySignup ? 'Signup' : 'Login'}
                            {this.props.loginLoading && <CircularProgress size={24} className={classes.buttonLoading} />}

                        </Button>
                    </form>
                    <ToggleText
                        displaySignup={this.state.displaySignup}
                        toggleView={this.toggleView}
                        className={classes.button}
                    />
                </div>
            </div>
        )
    }
}

interface Props {
    error: Error | undefined
    nodeUsername: string | undefined
    loginLoading: boolean
    login: Function
    signup: Function
    classes: any
}

interface State {
    displaySignup: boolean
    name: string
    password: string
    email: string
}

function ToggleText(props: { displaySignup: boolean, toggleView: Function, className: string }) {
    if (props.displaySignup) {
        return (
            <Typography>
                Already have an account?&nbsp;
                <a href="" className="link" onClick={props.toggleView as any}>Login</a>
            </Typography>
        )
    } else {
        return (
            <Typography>
                Don't have an account?&nbsp;
                <a href="" className="link" onClick={props.toggleView as any}>Signup</a>
            </Typography>
        )
    }
}


const styles = (theme: Theme) => createStyles({
    loginContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flexGrow: 1,

        '& > div': {
            flexGrow: 0,
            maxWidth: '50%',
            flexBasis: '50%',
            textAlign: 'center',
            marginTop: -50,

            '& > img': {
                width: 130,
                marginBottom: 30,
            },
        },
    },
    headline: {
        textAlign: 'center',
    },
    textField: {
        width: '100%',
        marginTop: '16px',
    },
    button: {
        textTransform: 'none',
        display: 'inline-block',
        width: '50%',
        marginTop: '32px',
        marginBottom: '16px',
    },
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    errorMessage: {
        marginBottom: '-20px',
    },
    link: {
        color: theme.palette.secondary.main,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        error: state.user.loginError,
        nodeUsername: state.user.nodeUsername,
        loginLoading: state.ui.loginLoading,
    }
}

const mapDispatchToProps = {
    login,
    signup,
}

const LoginPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(LoginPage))

export default LoginPageContainer

