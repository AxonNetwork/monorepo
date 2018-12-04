import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { IGlobalState } from 'redux/store'

class LoginPage extends React.Component<Props> {
	render() {
		// const { classes } = this.props
		return (
			<h1>Login Page</h1>
		)
	}
}

interface Props {
	classes: any
}

const styles = (theme: Theme) => createStyles({

})

const mapStateToProps = (state: IGlobalState) => {
    return {}
}

const mapDispatchToProps = {}

const LoginPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(LoginPage))

export default LoginPageContainer
