import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import UserAvatar from 'conscience-components/UserAvatar'
import SearchBar from 'conscience-components/SearchBar'
import { logout } from 'conscience-components/redux/user/userActions'
import { IGlobalState } from 'conscience-components/redux'
import { selectUser, selectSettings } from 'conscience-components/navigation'
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
        const username = (user || { username: '' }).username
        return (
            <AppBar position="static" className={classes.appbar}>
                <Link to={`/user/${username}`}>
                    <img src={logo} className={classes.img} alt="Axon Logo" />
                </Link>

                <SearchBar classes={{ root: classes.searchBar }} />

                <div style={{ flexGrow: 1 }}></div>

                {user !== undefined &&
                    <div className={classes.avatar}>
                        <IconButton onClick={this.openUserMenu} classes={{ root: classes.avatarButton }}>
                            <UserAvatar disableClick noTooltip user={user} />
                        </IconButton>
                        <Menu
                            classes={{ paper: classes.menuPaper }}
                            open={!!this.state.anchorEl}
                            anchorEl={this.state.anchorEl}
                            onClose={this.handleClose}
                        >
                            <MenuItem onClick={() => this.selectItem('profile')}>Your Profile</MenuItem>
                            <MenuItem onClick={() => this.selectItem('settings')}>Settings</MenuItem>
                            <MenuItem onClick={() => this.selectItem('logout')}>Logout</MenuItem>
                        </Menu>
                    </div>
                }
            </AppBar>
        )
    }

    openUserMenu(event: React.MouseEvent<HTMLElement>) {
        event.stopPropagation()
        this.setState({ anchorEl: event.currentTarget })
    }

    logout() {
        this.props.logout()
    }

    selectItem(selection?: string) {
        const username = (this.props.user || { username: '' }).username
        this.handleClose()
        switch (selection) {
            case 'profile':
                selectUser(username)
                return
            case 'settings':
                selectSettings()
                return
            case 'logout':
                this.logout()
                return
        }
    }

    handleClose() {
        this.setState({ anchorEl: null })
    }
}

interface Props {
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
        // justifyContent: 'space-between',
    },
    searchBar: {
        marginLeft: 10,
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
        marginTop: 36,
        marginRight: 32,
    },
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
)(withStyles(styles)(Header))
