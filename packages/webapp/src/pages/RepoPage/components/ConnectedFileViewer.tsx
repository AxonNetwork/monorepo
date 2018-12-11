import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { History } from 'history'
import FileViewer from 'conscience-components/FileViewer'
import { getFileContents } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IComment, IUser, IDiscussion } from 'conscience-lib/common'
import { autobind, isTextFile } from 'conscience-lib/utils'


@autobind
class ConnectedFileViewer extends React.Component<Props>
{
	render() {
		const { repoID, fileContents, ...other} = this.props
		return(
			<FileViewer {...other}
				repoRoot={repoID}
				fileContents={fileContents}
			    selectFile={this.selectFile}
			    selectDiscussion={this.selectDiscussion}
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
    	this.props.getFileContents({ repoID, filename })
    }

	selectFile(payload: {filename: string}) {
    	const repoID = this.props.repoID
    	const filename = payload.filename
    	if(filename === undefined) {
    		this.props.history.push(`/repo/${repoID}/file`)
    	}else{
    		this.props.history.push(`/repo/${repoID}/file/${filename}`)
    	}
    }

	selectDiscussion(payload: {discussionID: string}) {
    	const repoID = this.props.repoID
    	const discussionID = payload.discussionID
    	if(discussionID === undefined) {
    		this.props.history.push(`/repo/${repoID}/discussion`)
    	}else{
    		this.props.history.push(`/repo/${repoID}/discussion/${discussionID}`)
    	}
    }
}

type Props = OwnProps & StateProps & DispatchProps & { history: History }

interface OwnProps {
    filename: string
	repoID: string
}

interface StateProps {
	fileContents: string
    comments: {[commentID: string]: IComment}
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    codeColorScheme?: string | undefined
    backgroundColor?: string
}

interface DispatchProps {
	getFileContents: typeof getFileContents
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
	const repoID = ownProps.repoID
	const filename = ownProps.filename
	const repo = state.repo.repos[repoID] || {} as any
	const fileContents = ((repo.files || {} as any)[filename] || {} as any).contents || ''
	const comments = {}
	const users = {}
	const discussions = {}

	return {
		fileContents,
		comments,
		users,
		discussions
    }
}

const mapDispatchToProps = {
	getFileContents
}

export default withRouter(
	connect(
	    mapStateToProps,
	    mapDispatchToProps,
	)(ConnectedFileViewer) as any
)
