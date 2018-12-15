import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import MarkdownEditor from 'conscience-components/MarkdownEditor'
import { getFileContents, saveFileContents } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind, isTextFile } from 'conscience-lib/utils'


@autobind
class ConnectedMarkdownEditor extends React.Component<Props>
{
    state={ loading: true }

	render() {
		return(
			<MarkdownEditor
                repo={this.props.repo}
                filename={this.props.filename}
                loading={this.state.loading}
                comments={this.props.comments}
                users={this.props.users}
                discussions={this.props.discussions}
                codeColorScheme={this.props.codeColorScheme}
			    selectFile={this.selectFile}
			    selectDiscussion={this.selectDiscussion}
                saveFileContents={this.props.saveFileContents}
			/>
		)
	}

    componentDidMount() {
        if (isTextFile(this.props.filename)) {
            this.getFileContents()
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (
			isTextFile(this.props.filename) &&
            (prevProps.filename !== this.props.filename || prevProps.repoID !== this.props.repoID)
        ) {
            this.getFileContents()
        }
    }

    getFileContents() {
    	const { repoID, filename } = this.props
        const self = this
    	this.props.getFileContents({
            repoID,
            filename,
            callback: (err?: Error) => {
                self.setState({ loading: false })
            }
        })
    }

	selectFile(payload: {filename: string | undefined, mode: FileMode}) {
    	const repoID = this.props.repoID
    	const filename = payload.filename
    	if(filename === undefined) {
    		this.props.history.push(`/repo/${repoID}/file`)
    	}else{
    		this.props.history.push(`/repo/${repoID}/file/${filename}`)
    	}
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

type Props = StateProps & DispatchProps & RouteComponentProps<MatchParams>

interface MatchParams {
    filename: string
	repoID: string
}

interface StateProps {
    filename: string
    repoID: string
    repo: IRepo
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    comments: {[commentID: string]: IComment}
    codeColorScheme?: string | undefined
}

interface DispatchProps {
	getFileContents: typeof getFileContents
    saveFileContents: typeof saveFileContents
}

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
    const { repoID, filename } = ownProps.match.params
	const repo = state.repo.repos[repoID]

	return {
        filename,
        repoID,
		repo,
        users: state.user.users,
		discussions: state.discussion.discussions,
        comments: state.discussion.comments,
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

const mapDispatchToProps = {
	getFileContents,
    saveFileContents,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ConnectedMarkdownEditor))
