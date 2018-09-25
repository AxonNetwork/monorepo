import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import GetAppIcon from '@material-ui/icons/GetApp'

class PullButton extends Component {

    constructor(props) {
        super(props)
    }

    pullRepo() {
        this.props.pullRepo(this.props.folderPath, this.props.repoID)
    }

    render() {
        const classes = this.props.classes

        return (
            <Button variant="contained" size="small" color="secondary" className={classes.button} onClick={() => this.pullRepo()}>
                Pull
                <GetAppIcon className={classes.icon} />
            </Button>
        )
    }
}

PullButton.propTypes = {
    classes: PropTypes.object.isRequired,
    pullRepo: PropTypes.func.isRequired,
    folderPath: PropTypes.string.isRequired,
    repoID: PropTypes.string.isRequired,
}

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit,
        textTransform: 'none',
    },
    icon: {
        fontSize: '14pt',
        marginLeft: theme.spacing.unit,
    },
})

export default withStyles(styles)(PullButton)
