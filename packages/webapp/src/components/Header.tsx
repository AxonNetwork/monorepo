import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import UserAvatar from 'conscience-components/UserAvatar'
import { logout } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import { IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'

const logo = require('../assets/logo-invert.png')


@autobind
class Header extends React.Component<Props, State>
{
	state = {
		anchorEl: null,
	}

	render() {
		const { user, classes } = this.props
		return (
			<AppBar position="static" className={classes.appbar}>
				<Link to='/repo'>
					<img src={logo} className={classes.img} alt="Conscience Logo"/>
				</Link>
				{user !== undefined &&
					<div className={classes.avatar}>
						<IconButton onClick={this.openUserMenu} classes={{ root: classes.avatarButton}}>
							<UserAvatar
								username={user.name}
								userPicture={user.picture}
							/>
						</IconButton>
						<Popper
							open={Boolean(this.state.anchorEl)}
							anchorEl={this.state.anchorEl}
							transition
						>
							{({ TransitionProps, placement }) => (
								<Grow
									{...TransitionProps}
									style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
								>
									<Paper className={classes.menuPaper}>
										<div className={classes.pointerTriangle} />
										<ClickAwayListener onClickAway={this.handleClose}>
											<MenuList>
												<MenuItem onClick={()=>this.selectItem('repos')}>Your Repositories</MenuItem>
												<MenuItem onClick={()=>this.selectItem('settings')}>Settings</MenuItem>
												<MenuItem onClick={()=>this.selectItem('logout')}>Logout</MenuItem>
											</MenuList>
										</ClickAwayListener>
									</Paper>
								</Grow>
							)}
						</Popper>
					</div>
				}
			</AppBar>
		)
	}

	openUserMenu(event: React.MouseEvent<HTMLElement>) {
		this.setState({ anchorEl: event.currentTarget })
	}

	selectItem(selection?: string) {
		this.handleClose()
		switch(selection) {
			case 'repos':
				this.props.history.push('/repo')
				return
			case 'settings':
				this.props.history.push('/settings')
				return
			case 'logout':
				this.props.logout()
				return
		}
	}

	handleClose() {
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
		width: 48,
		height: 48,
	},
	avatar: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 64,
	},
	avatarButton: {
		padding: 0,
	},
	menuPaper: {
		marginTop: 14,
		marginRight: 32,
	},
	pointerTriangle: {
		position: 'absolute',
		top: -5,
		right: 28,
		width: 0,
		height: 0,
		borderLeft: '5px solid transparent',
		borderRight: '5px solid transparent',
		borderBottom: '5px solid white',
	}
})

const mapStateToProps = (state: IGlobalState) => {
	const user = state.user.users[state.user.currentUser || '']
    return {
    	user,
    }
}

const mapDispatchToProps = {
	logout,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(withRouter(Header)))
