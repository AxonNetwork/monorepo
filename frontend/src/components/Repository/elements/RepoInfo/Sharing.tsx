import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'
import ControlPointIcon from '@material-ui/icons/ControlPoint'

import AddCollaboratorDialog from './AddCollaboratorDialog'

class Sharing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleClickOpen() {
        this.setState({
            open: true,
        })
    }

    handleClose() {
        this.setState({
            open: false,
        })
    }

    render() {
        const classes = this.props.classes
        let sharedUsers = this.props.sharedUsers || []
        return (
            <div>
                <Typography className={classes.text}>
                    Shared with:
                    {sharedUsers.length === 0 &&
                        ' none'
                    }
                </Typography>
                {sharedUsers.map(collaborator =>
                    <Chip label={collaborator} key={collaborator} className={classes.chip} />,
                )}
                <IconButton className={classes.button} onClick={this.handleClickOpen} >
                    <ControlPointIcon className={classes.icon} />
                </IconButton>
                <AddCollaboratorDialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    folderPath={this.props.folderPath}
                    repoID={this.props.repoID}
                    addCollaborator={this.props.addCollaborator}
                />
            </div>
        )
    }
}

Sharing.propTypes = {
    sharedUsers: PropTypes.array,
    folderPath: PropTypes.string.isRequired,
    repoID: PropTypes.string.isRequired,
    addCollaborator: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({
    text: {
        marginTop: '12px',
        display: 'inline-block',

    },
    button: {
        width: '24px',
        height: '24px',
        padding: 0,
    },
    icon: {
        fontSize: '14pt',
    },
    chip: {
        margin: '2px 4px',
    },
})

export default withStyles(styles)(Sharing)
