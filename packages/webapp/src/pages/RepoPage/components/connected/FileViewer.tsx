import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import FileViewer from 'conscience-components/FileViewer'
import { getFileContents } from 'redux/repo/repoActions'
import { IGlobalState } from 'redux/store'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind, isTextFile, getConscienceURI } from 'conscience-lib/utils'


@autobind
class ConnectedFileViewer extends React.Component<Props>
{
	render() {
		const { repoID, ...other} = this.props
		return(
			<FileViewer
                {...other}
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

type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps<any>

interface OwnProps {
    filename: string
	repoID: string
}

interface StateProps {
    repo: IRepo
    fileContents: string | undefined
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    comments: {[commentID: string]: IComment}
    codeColorScheme?: string | undefined
    backgroundColor?: string
}

interface DispatchProps {
	getFileContents: typeof getFileContents
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const fileURI = getConscienceURI(ownProps.repoID, ownProps.filename)
	return {
        fileContents: state.repo.fileContents[fileURI],
        repo: state.repo.repos[ownProps.repoID],
        users: state.user.users,
        discussions: state.discussion.discussions,
        comments: state.discussion.comments,
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

const mapDispatchToProps = {
	getFileContents
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ConnectedFileViewer))
