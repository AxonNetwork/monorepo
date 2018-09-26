import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { logout } from 'redux/user/userActions'

export interface SettingsProps {
    logout: Function
    classes: any
}

class Settings extends React.Component<SettingsProps>
{
    render() {
        const { classes } = this.props

        return (
            <React.Fragment>
                <Typography variant="headline" className={classes.headline}>Settings</Typography>
                <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.props.logout()}>
                    Logout
                </Button>
            </React.Fragment>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    headline: {
        marginBottom: theme.spacing.unit * 2,
    },
    button: {
        textTransform: 'none',
    },
})

const mapStateToProps = () => {}

const mapDispatchToProps = { logout }

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Settings))