import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import UserAvatar from 'conscience-components/UserAvatar'
import { logout } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import { IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'

const logo = require('../assets/logo-invert.png')


@autobind
class Header extends React.Component<Props, State> {
	state={
		anchorEl: null
	}

	render() {
		const { user, history, classes } = this.props
		if(history.location.pathname === '/login'){
			return null
		}
		return (
			<AppBar position="static" className={classes.appbar}>
				<Link to='/repo'>
					<img
						src={logo}
						className={classes.img}
						alt="Conscience Logo"
						/>
				</Link>
				{user !== undefined &&
					<div className={classes.avatar}>
						<IconButton onClick={this.openUserMenu}>
							<UserAvatar
								username={user.name}
								userPicture={user.picture}
							/>
						</IconButton>
						<Menu
							anchorEl={this.state.anchorEl}
							open={Boolean(this.state.anchorEl)}
							onClose={this.handleClose}
						>
							<MenuItem onClick={()=>this.selectItem('settings')}>Settings</MenuItem>
							<MenuItem onClick={()=>this.selectItem('logout')}>Logout</MenuItem>
						</Menu>
					</div>
				}
			</AppBar>
		)
	}

	openUserMenu(event: React.MouseEvent<HTMLElement>){
		this.setState({ anchorEl: event.currentTarget })
	}

	selectItem(selection?: string){
		this.handleClose()
		switch(selection){
			case 'settings':
				this.props.history.push('/settings')
				return
			case 'logout':
				this.props.logout()
				return
		}
	}

	handleClose(){
		this.setState({ anchorEl: null })
	}
}

interface Props extends RouteComponentProps {
	user: IUser | undefined
	logout: typeof logout
	classes: any
}

interface State {
	anchorEl: HTMLElement | null
}

const styles = (theme: Theme) => createStyles({
	appbar: {
		paddingLeft: 8,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	img: {
		width: 64,
		height: 64,
	},
	avatar: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 64,
	}
})

const mapStateToProps = (state: IGlobalState) => {
	const user = state.user.users[state.user.currentUser || '']
    return {
    	user,
    }
}

const mapDispatchToProps = {
	logout
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(withRouter(Header)))
