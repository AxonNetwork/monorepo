import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

class Settings extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        const classes = this.props.classes

        return (
            <React.Fragment>
                <Typography variant="headline" className={classes.headline}>Settings</Typography>
                <Button variant="contained" color="secondary" className={classes.button} onClick={()=>this.props.logout()}>
                    Logout
                </Button>
            </React.Fragment>
        )
    }
}

Settings.propTypes = {
    logout: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    headline:{
        marginBottom: theme.spacing.unit*2
    },
    button:{
        textTransform: 'none'
    },
})

export default withStyles(styles)(Settings)
