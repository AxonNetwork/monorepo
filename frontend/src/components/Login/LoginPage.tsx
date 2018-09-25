import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'

import logo from '../../assets/img/logo.png'

import { login, signup, fetchUserData } from '../../redux/user/userActions'

class LoginPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            displaySignup: false,
            name: '',
            password: '',
            email: '',
        }

        this.toggleView = this.toggleView.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        this.props.fetchUserData()
    }

    toggleView(event) {
        event.preventDefault()
        this.setState({
            displaySignup: !this.state.displaySignup,
        })
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        if (this.state.displaySignup) {
            this.props.signup(this.state.name, this.state.email, this.state.password)
        }else {
            this.props.login(this.state.email, this.state.password)
        }
    }

    render() {
        const classes = this.props.classes
        if (this.props.user.loggedIn) {
            return null
        }
        const error = this.props.user.error
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
                                    error={error !== undefined}
                                />
                            }
                            <TextField
                                id="email"
                                label="Email"
                                value={this.state.email}
                                onChange={this.handleChange('email')}
                                className={classes.textField}
                                error={error !== undefined}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleChange('password')}
                                className={classes.textField}
                                error={error !== undefined}
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

function ToggleText(props) {
    if (props.displaySignup) {
        return(
            <Typography>
                Already have an account?&nbsp;
                <a href="" className="link" onClick={props.toggleView}>Login</a>
            </Typography>
        )
    }else {
        return(
            <Typography>
                Don't have an account?&nbsp;
                <a href="" className="link" onClick={props.toggleView}>Signup</a>
            </Typography>
        )
    }
}

LoginPage.propTypes = {
    user: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    signup: PropTypes.func.isRequired,
    fetchUserData: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({
    loginContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',

        '& > div': {
            flexGrow: '0',
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

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = {
    login,
    signup,
    fetchUserData,
}

const LoginPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(LoginPage))

export default LoginPageContainer

