import React from 'react'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import { cloneSharedRepo, ignoreSharedRepo } from '../../redux/user/userActions'
import { IGlobalState } from 'redux/store'
import autobind from 'utils/autobind'


@autobind
class SharedReposDialog extends React.Component<Props, State>
{
    state = {
        open: true,
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.sharedRepoID !== this.props.sharedRepoID) {
            this.setState({ open: true })
        }
    }

    handleClose() {
        this.setState({ open: false })
    }

    cloneRepo() {
        this.handleClose()
        this.props.cloneSharedRepo({ repoID: this.props.sharedRepoID })
    }

    ignoreSharedRepo() {
        this.handleClose()
        this.props.ignoreSharedRepo({ repoID: this.props.sharedRepoID })
    }

    render() {
        if (this.props.sharedRepoID === undefined) {
            return null
        }
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
            >
                <DialogContent>
                    <DialogContentText>
                        Repository "{this.props.sharedRepoID}" has been shared with you. Add to Conscience?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.cloneRepo} color="secondary">
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
    sharedRepoID: string|undefined
    cloneSharedRepo: Function
    ignoreSharedRepo: Function
}

interface State {
    open: boolean
}

const mapStateToProps = (state: IGlobalState) => {
    const sharedReposObj = (state.user.users[ state.user.currentUser || '' ] || {}).sharedRepos || {}
    let toPrompt = Object.keys(sharedReposObj).filter(repoID => !sharedReposObj[repoID].ignored)
    let sharedRepoID: string|undefined
    if (toPrompt.length > 0) {
        sharedRepoID = toPrompt[0]
    }
    return {
        sharedRepoID,
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