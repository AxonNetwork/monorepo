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

export interface LoginPageProps {
    error: Error|null
    login: Function
    signup: Function
    classes: any
}

export interface LoginPageState {
    displaySignup: boolean
    name: string
    password: string
    email: string
}

@autobind
class LoginPage extends React.Component<LoginPageProps, LoginPageState> {

    state = {
        displaySignup: false,
        name: '',
        password: '',
        email: ''
    }

    toggleView(event: Event){
        event.preventDefault()
        this.setState({
            displaySignup: !this.state.displaySignup,
        })
    }

    handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        this.setState((current)=>({
            ...current,
            [name]: value,
        }))
    }

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (this.state.displaySignup) {
            this.props.signup({name: this.state.name, email: this.state.email, password: this.state.password})
        }else {
            this.props.login({email: this.state.email, password: this.state.password})
        }
    }

    render() {
        const {error, classes } = this.props
        return (
            <div className={classes.loginContainer}>
                <div>
                        <img src={logo} alt="Conscience Logo" />

                        <Typography className={classes.headline} variant="headline">
                            {this.state.displaySignup ? 'Signup' : 'Login'}
                        </Typography>
                        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            {this.state.displaySignup &&
                                <TextField
                                    id="name"
                                    label="Name"
                                    value={this.state.name}
                                    onChange={this.handleChange('name')}
                                    className={classes.textField}
                                    error={error !== null}
                                />
                            }
                            <TextField
                                id="email"
                                label="Email"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                className={classes.textField}
                                error={error !== null}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                className={classes.textField}
                                error={error !== null}
                            />
                            {error !== undefined &&
                                <FormHelperText error className={classes.errorMessage}>{error}</FormHelperText>
                            }
                            <Button variant="raised" color="secondary" className={classes.button} type="submit">
                                {this.state.displaySignup ? 'Signup' : 'Login'}
                            </Button>
                        </form>
                        <ToggleText
                            displaySignup = {this.state.displaySignup}
                            toggleView = {this.toggleView}
                            className={classes.button}
                        />
                </div>
            </div>
        )
    }
}

interface ToggleTextProps{
    displaySignup: boolean
    toggleView: Function
    className: string
}

function ToggleText(props: ToggleTextProps) {
    if (props.displaySignup) {
        return(
            <Typography>
                Already have an account?&nbsp;
                <a href="" className="link" onClick={props.toggleView as any}>Login</a>
            </Typography>
        )
    }else {
        return(
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
        error: state.user.error
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

