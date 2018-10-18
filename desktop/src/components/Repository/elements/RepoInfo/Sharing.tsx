import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { IGlobalState } from 'redux/store'
import { IUser } from 'common'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'
import ControlPointIcon from '@material-ui/icons/ControlPoint'

import AddCollaboratorDialog from './AddCollaboratorDialog'
import autobind from 'utils/autobind'
import { addCollaborator, removeCollaborator } from 'redux/repository/repoActions'


@autobind
class Sharing extends React.Component<Props, State>
{
    state = {
        open: false,
    }

    handleDelete(collaborator: string) {
        this.props.removeCollaborator({
            repoID: this.props.repoID,
            folderPath: this.props.folderPath,
            email: collaborator,
        })
    }

    handleClickOpen() {
        this.setState({ open: true })
    }

    handleClose() {
        this.setState({ open: false })
    }

    render() {
        const { sharedUsers, folderPath, repoID, addCollaborator, classes } = this.props
        return (
            <div>
                <Typography className={classes.text}>
                    Shared with:
                    {sharedUsers.length === 0 &&
                        ' none'
                    }
                </Typography>
                {sharedUsers.map(userID =>
                    <Chip
                        label={(this.props.users[userID] || {}).name || userID}
                        key={userID}
                        className={classes.chip}
                        onDelete={() => this.handleDelete(userID)}
                    />,
                )}
                <IconButton className={classes.button} onClick={this.handleClickOpen} >
                    <ControlPointIcon className={classes.icon} />
                </IconButton>
                <AddCollaboratorDialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    folderPath={folderPath}
                    repoID={repoID}
                    addCollaborator={addCollaborator}
                />
            </div>
        )
    }
}

interface Props {
    sharedUsers: string[]
    folderPath: string
    repoID: string

    users: {[userID: string]: IUser}

    addCollaborator: typeof addCollaborator
    removeCollaborator: typeof removeCollaborator

    classes?: any
}

interface State {
    open: boolean
}

const styles = createStyles({
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

const mapStateToProps = (state: IGlobalState) => {
    return {
        users: state.user.users,
    }
}

const mapDispatchToProps = {
    addCollaborator,
    removeCollaborator,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Sharing))
