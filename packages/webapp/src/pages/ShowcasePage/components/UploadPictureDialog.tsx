import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { autobind } from 'conscience-lib/utils'

@autobind
class SelectRepoDialog extends React.Component<Props>
{
    _inputPicture: HTMLInputElement | null = null

    render() {
        const { open, classes } = this.props
        return (
            <Dialog onClose={() => this.props.onSelectImg(null)} open={open}>
                <DialogTitle>
                    Change Organization Picture
                </DialogTitle>
                <DialogContent>
                    <input type="file" ref={x => this._inputPicture = x} /><br />
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={() => this.props.onSelectImg(this._inputPicture)}
                    >
                        Upload
                    </Button>
                </DialogContent>
            </Dialog>
        )
    }
}

interface Props {
    open: boolean
    onSelectImg: (imgFile: any) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    button: {
        marginTop: 16,
        textTransform: 'none',
    }
})

export default withStyles(styles)(SelectRepoDialog)