import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'
import ControlPointIcon from '@material-ui/icons/ControlPoint'

import AddCollaboratorDialog from './AddCollaboratorDialog'
import autobind from '../../../../utils/autobind'

export interface SharingProps {
    sharedUsers: Array<string>
    folderPath: string
    repoID: string
    addCollaborator: Function
    removeCollaborator: Function
    classes:{
        text: string
        button: string
        icon: string
        chip: string
    }
}

export interface SharingState {
    open: boolean
}

@autobind
class Sharing extends React.Component<SharingProps, SharingState>
{

    state = {
        open: false
    }

    handleDelete(collaborator: string){
        this.props.removeCollaborator({
            repoID: this.props.repoID,
            folderPath: this.props.folderPath,
            email: collaborator
        })
    }

    handleClickOpen(){
        this.setState({
            open: true,
        })
    }

    handleClose(){
        this.setState({
            open: false,
        })
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
                {sharedUsers.map(collaborator =>
                    <Chip
                        label={collaborator}
                        key={collaborator}
                        className={classes.chip}
                        onDelete={()=>this.handleDelete(collaborator)}
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

export default withStyles(styles)(Sharing)
