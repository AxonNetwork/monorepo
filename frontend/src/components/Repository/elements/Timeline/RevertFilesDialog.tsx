import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'

import { ITimelineEvent } from '../../../../common'
import autobind from 'utils/autobind'

export interface RevertFilesDialogProps {
    event: ITimelineEvent
    folderPath: string
    revertFiles: Function
    onClose: Function
    open: boolean
    classes: any
}

export interface RevertFilesDialogState {
    checked: string[]
}

@autobind
class RevertFilesDialog extends React.Component<RevertFilesDialogProps, RevertFilesDialogState>
{
    state={
        checked: ([] as string[])
    }

    handleClose(){
        this.props.onClose()
    }

    handleToggle = (file: string) => {
        const { checked } = this.state
        const currentIndex = checked.indexOf(file)
        const newChecked = [...checked]

        if (currentIndex === -1) {
            newChecked.push(file)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        this.setState({
            checked: newChecked,
        })
    }

    revertFiles = () => {
        this.props.revertFiles(this.props.folderPath, this.state.checked, this.props.event.commit)
        this.handleClose()
    }

    render() {
        const {classes, open, event} = this.props

        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle>Revert Files</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <List>
                        {event.files.map(file => {
                            return(
                                <ListItem
                                    key={file}
                                    onClick={() => {this.handleToggle(file)}}
                                    className={classes.listItem}
                                >
                                    <Checkbox
                                        checked={this.state.checked.indexOf(file) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemText primary={file} />
                                </ListItem>
                            )
                        })}
                    </List>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button color="secondary" variant="contained" className={classes.button} onClick={this.revertFiles}>
                        Revert
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    dialogContent: {
        minWidth: 350,
        paddingBottom: 0,
    },
    dialogActions: {
        justifyContent: 'flex-start',
    },
    listItem: {
        padding: 0,
        marginLeft: -12,
    },
    button: {
        margin: theme.spacing.unit * 2,
    },
})

export default withStyles(styles)(RevertFilesDialog)