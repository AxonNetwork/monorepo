import React from 'react'
import { connect } from 'react-redux'
import { History } from 'history'
import CreateDiscussion from 'conscience-components/CreateDiscussion'
import { createDiscussion } from 'redux/discussion/discussionActions'
import { IGlobalState } from 'redux/store'
import { IRepoFile, IUser, IDiscussion } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class ConnectedCreateDiscussion extends React.Component<Props>
{
    render() {
        return (
            <CreateDiscussion
                repoID={this.props.repoID}
                attachedTo={this.props.attachedTo}
                commentWrapperClasses={this.props.commentWrapperClasses}
                user={this.props.user}
                files={this.props.files}
                discussions={this.props.discussions}
                createDiscussion={this.props.createDiscussion}
                selectUser={this.selectUser}
            />
        )
    }

    selectUser(payload: { username: string | undefined }) {
        const username = payload.username
        if (username === undefined) {
            return
        }
        this.props.history.push(`/user/${username}`)
    }
}

type Props = OwnProps & StateProps & DispatchProps

interface OwnProps {
    repoID: string | undefined
    attachedTo?: string
    commentWrapperClasses?: any
    history: History
}

interface StateProps {
    user: IUser
    files: { [name: string]: IRepoFile }
    discussions: { [discussionID: string]: IDiscussion }
}

interface DispatchProps {
    createDiscussion: typeof createDiscussion
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        user: state.user.users[state.user.currentUser || ''],
        files: (state.repository.repos[ownProps.repoID || ''] || {}).files || {},
        discussions: state.discussion.discussions,
    }
}

const mapDispatchToProps = {
    createDiscussion
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectedCreateDiscussion)

