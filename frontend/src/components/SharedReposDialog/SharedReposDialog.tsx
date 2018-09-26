import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import { addSharedRepo, ignoreRepo } from '../../redux/sharedRepos/sharedReposActions'
import { IRepo } from 'common'
import { IGlobalState } from 'redux/store'

export interface SharedReposDialogProps {
    sharedRepo: IRepo
    addSharedRepo: Function
    ignoreRepo: Function
}

export interface SharedReposDialogState {
    open: boolean
}

class SharedReposDialog extends React.Component<SharedReposDialogProps, SharedReposDialogState>
{
    state={
        open: true
    }

    componentWillReceiveProps(nextProps: SharedReposDialogProps) {
        if (nextProps.sharedRepo !== this.props.sharedRepo) {
            this.setState({ open: true })
        }
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    addRepo = () => {
        this.handleClose()
        this.props.addSharedRepo(this.props.sharedRepo.repoID)
    }

    ignoreRepo = () => {
        this.handleClose()
        this.props.ignoreRepo(this.props.sharedRepo.repoID)
    }

    render() {
        if (this.props.sharedRepo === undefined) {
            return null
        }
        const repoID = this.props.sharedRepo.repoID
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
            >
                <DialogContent>
                    <DialogContentText>
                        Repository "{repoID}" has been shared with you. Add to Conscience?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.addRepo} color="secondary">
                        Add
                    </Button>
                    <Button onClick={this.ignoreRepo} color="secondary" autoFocus>
                        Ignore
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

const mapStateToProps = (state: IGlobalState) => {
    let toPrompt = state.sharedRepos.filter(repo => !repo.ignored)
    let sharedRepo
    if (toPrompt.length > 0) {
        sharedRepo = toPrompt[0]
    }
    return {
        sharedRepo: sharedRepo,
    }
}

const mapDispatchToProps = {
    addSharedRepo,
    ignoreRepo,
}

const SharedReposDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SharedReposDialog)

export default SharedReposDialogContainer