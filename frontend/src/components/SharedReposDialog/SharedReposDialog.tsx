import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import { cloneSharedRepo, ignoreSharedRepo } from '../../redux/user/userActions'
import { IRepo } from 'common'
import { IGlobalState } from 'redux/store'

class SharedReposDialog extends React.Component<Props, State>
{
    state = {
        open: true,
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.sharedRepo !== this.props.sharedRepo) {
            this.setState({ open: true })
        }
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    addRepo = () => {
        this.handleClose()
        this.props.cloneSharedRepo(this.props.sharedRepo.repoID)
    }

    ignoreSharedRepo = () => {
        this.handleClose()
        this.props.ignoreSharedRepo(this.props.sharedRepo.repoID)
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
                    <Button onClick={this.ignoreSharedRepo} color="secondary" autoFocus>
                        Ignore
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

interface Props {
    sharedRepo: IRepo
    cloneSharedRepo: Function
    ignoreSharedRepo: Function
}

interface State {
    open: boolean
}

const mapStateToProps = (state: IGlobalState) => {
    const sharedReposObj = (state.user.users[ state.user.currentUser || '' ] || {}).sharedRepos || {}
    let toPrompt = Object.keys(sharedReposObj).filter(repoID => !sharedReposObj[repoID].ignored)
    let sharedRepo
    if (toPrompt.length > 0) {
        sharedRepo = toPrompt[0]
    }
    return {
        sharedRepo,
    }
}

const mapDispatchToProps = {
    cloneSharedRepo,
    ignoreSharedRepo,
}

const SharedReposDialogContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SharedReposDialog)

export default SharedReposDialogContainer