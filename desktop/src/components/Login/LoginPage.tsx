import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'

import logo from '../../assets/img/logo.png'

import { login, signup } from '../../redux/user/userActions'
import { IGlobalState } from 'redux/store'
import autobind from 'utils/autobind'


@autobind
class LoginPage extends React.Component<Props, State> {

    state = {
        displaySignup: false,
        name: '',
        username: '',
        password: '',
        email: '',
    }

    toggleView(event: Event) {
        event.preventDefault()
        this.setState({
            displaySignup: !this.state.displaySignup,
        })
    }

    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        this.setState((current) => ({
            ...current,
            [name]: value,
        }))
    }

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (this.state.displaySignup) {
            this.props.signup({name: this.state.name, username: this.state.username, email: this.state.email, password: this.state.password})
        }else {
            this.props.login({email: this.state.email, password: this.state.password})
        }
    }

    render() {
        const { error, classes } = this.props
        return (
            <div className={classes.loginContainer}>
                <div>
                        <img src={logo} alt="Conscience Logo" />

                        <Typography className={classes.headline} variant="headline">
                            {this.state.displaySignup ? 'Signup' : 'Login'}
                        </Typography>
                        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            {this.state.displaySignup &&
                                <React.Fragment>
                                    <TextField
                                        id="username"
                                        label="Username"
                                        disabled={!!this.props.nodeUsername}
                                        value={this.props.nodeUsername || this.state.username}
                                        onChange={this.handleChange('username')}
                                        className={classes.textField}
                                        error={!!error}
                                    />
                                    <TextField
                                        id="name"
                                        label="Full Name"
                                        value={this.state.name}
                                        onChange={this.handleChange('name')}
                                        className={classes.textField}
                                        error={!!error}
                                    />
                                </React.Fragment>
                            }
                            <TextField
                                id="email"
                                label="Email"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                className={classes.textField}
                                error={!!error}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                className={classes.textField}
                                error={!!error}
                            />
                            {error !== undefined &&
                                <FormHelperText error className={classes.errorMessage}>{error}</FormHelperText>
                            }
                            <Button variant="raised" color="secondary" className={classes.button} type="submit">
                                {this.state.displaySignup ? 'Signup' : 'Login'}
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
    errorMessage: {
        marginBottom: '-20px',
    },
    link: {
        color: theme.palette.secondary.main,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        error: state.user.error,
        nodeUsername: state.user.nodeUsername,
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

