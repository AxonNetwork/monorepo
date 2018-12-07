import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { login } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import autobind from 'conscience-lib/utils/autobind'


@autobind
class LoginPage extends React.Component<Props> {
	_inputEmail: HTMLInputElement | null = null
	_inputPassword: HTMLInputElement | null = null

	onClickSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        const email = this._inputEmail !== null ? this._inputEmail.value : ''
        const password = this._inputPassword !== null ? this._inputPassword.value : ''
        this.props.login({ email, password })
	}

	render() {
		const { checkedLoggedIn, loggedIn, classes } = this.props
		const { from } = this.props.location.state || { from: {pathname: "/" } }
		if(!checkedLoggedIn){
			return <div></div>
		}
		if(loggedIn){
			return <Redirect to={from} />
		}
		return (
			<main className={classes.main}>
				<Card className={classes.card}>
					<CardContent>
						<form onSubmit={this.onClickSubmit}>
							<Typography variant="h4">
								Conscience
							</Typography>
							<TextField
								label="Email"
								className={classes.textField}
								inputRef={ x => this._inputEmail = x }
							/>
							<TextField
								label="Password"
								type="password"
								className={classes.textField}
								inputRef={ x => this._inputPassword = x }
							/>
							<Button
								color="secondary"
								type="submit"
								className={classes.button}
								variant="contained"
							>
								Login
							</Button>
						</form>
					</CardContent>
				</Card>
			</main>
		)
	}
}

interface Props {
	location: any
	checkedLoggedIn: boolean
	loggedIn: boolean
	login: typeof login
	classes: any
}

const styles = (theme: Theme) => createStyles({
	main: {
		display: 'flex',
		justifyContent: 'center',
	},
	card: {
		marginTop: 200,
		width: '50%',
		maxWidth: 800,
	},
	textField: {
		width: '100%',
		marginTop: 16,
		marginBottom: 16,
	},
	button: {
		textTransform: 'none'
	}
})

const mapStateToProps = (state: IGlobalState) => {
	const checkedLoggedIn = state.user.checkedLoggedIn
	const loggedIn = state.user.currentUser !== undefined
    return {
    	checkedLoggedIn,
    	loggedIn,
    }
}

const mapDispatchToProps = (dispatch: Function) => {
	login
}

const LoginPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(LoginPage))

export default LoginPageContainer
