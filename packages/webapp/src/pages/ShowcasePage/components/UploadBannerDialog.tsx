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
    _inputBanner: HTMLInputElement | null = null

    render() {
        const { open, classes } = this.props

        return (
            <Dialog onClose={() => this.props.onSelectBanner(null)} open={open}>
                <DialogTitle>
                    Change Org Banner
				</DialogTitle>
                <DialogContent>
                    <input type="file" ref={x => this._inputBanner = x} /><br />
                    <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        onClick={() => this.props.onSelectBanner(this._inputBanner)}
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
    onSelectBanner: (fileInput: any) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    button: {
        marginTop: 16,
        textTransform: 'none',
    }
})

export default withStyles(styles)(SelectRepoDialog)