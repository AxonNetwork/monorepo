import React from 'react'
import { connect } from 'react-redux'
import { History } from 'history'
import DiscussionList from 'conscience-components/DiscussionList'
import { IGlobalState } from 'redux/store'
import { IUser, IDiscussion } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class ConnectedDiscussionList extends React.Component<Props>
{
	render() {
		return(
			<DiscussionList
				discussions={this.props.discussions}
				order={this.props.discussionIDsSortedByNewestComment}
				maxLength={this.props.maxLength}
				users={this.props.users}
				newestViewedCommentTimestamp={this.props.newestViewedCommentTimestamp}
				newestCommentTimestampPerDiscussion={this.props.newestCommentTimestampPerDiscussion}
				selectDiscussion={this.selectDiscussion}
			/>
		)
	}

	selectDiscussion(payload: {discussionID: string | undefined}) {
    	const repoID = this.props.repoID
    	const discussionID = payload.discussionID
    	if(discussionID === undefined) {
    		this.props.history.push(`/repo/${repoID}/discussion`)
    	}else{
    		this.props.history.push(`/repo/${repoID}/discussion/${discussionID}`)
    	}
    }
}

// interface Props {
//     discussions: {[discussionID: string]: IDiscussion}
//     order?: string[]
//     selectedID?: string | undefined
//     users: {[email: string]: IUser}
//     newestViewedCommentTimestamp: {[discussionID: string]: number}

//     selectDiscussion: (payload: {discussionID: string | undefined}) => void

// 	classes:any
// }

type Props = OwnProps & StateProps

interface OwnProps {
	repoID: string
	history: History
	maxLength: number
}

interface StateProps {
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    newestViewedCommentTimestamp: {[discussionID: string]: number}
    newestCommentTimestampPerDiscussion: {[discussionID: string]: number}
    discussionIDsSortedByNewestComment: string[]
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
	const repoID = ownProps.repoID

	return {
		discussions: state.discussion.discussions,
		users: state.user.users,
	    // newestViewedCommentTimestamp: (state.user.userSettings.newestViewedCommentTimestamp[repoID] || {}),
	    newestViewedCommentTimestamp: {},
        newestCommentTimestampPerDiscussion: state.discussion.newestCommentTimestampPerDiscussion,
        discussionIDsSortedByNewestComment: (state.discussion.discussionIDsSortedByNewestComment[repoID] || []),
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectedDiscussionList)

