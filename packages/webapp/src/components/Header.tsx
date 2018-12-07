import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'

const logo = require('../assets/logo-invert.png')

class Header extends React.Component<Props> {
	render() {
		const { classes } = this.props
		return (
			<AppBar position="static" className={classes.appbar}>
				<img
					src={logo}
					className={classes.img}
					alt="Conscience Logo"
					/>
			</AppBar>
		)
	}
}

interface Props {
	classes: any
}

const styles = (theme: Theme) => createStyles({
	appbar: {
		paddingLeft: 8
	},
	img: {
		width: 64,
		height: 64,
	}
})

export default withStyles(styles)(Header)