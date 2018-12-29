import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import FileViewer from 'conscience-components/FileViewer'
import { IGlobalState } from 'redux/store'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind, fileType } from 'conscience-lib/utils'
import axios from 'axios'


@autobind
class ConnectedFileViewer extends React.Component<Props>
{
	render() {
		const { repoID, ...other} = this.props

        const imgPrefix = this.imgPrefix()
		return(
			<FileViewer
                {...other}
                imgPrefix={imgPrefix}
                getFileContents={this.getFileContents}
			    selectFile={this.selectFile}
			    selectDiscussion={this.selectDiscussion}
			/>
		)
	}

    imgPrefix() {
        const API_URL = process.env.API_URL
        const repoID = this.props.repoID
        const prefix = `${API_URL}/repo/${repoID}/file`
        return prefix
    }

    async getFileContents(filename: string) {
        const imgPrefix = this.imgPrefix()
        const fileUrl = `${imgPrefix}/${filename}`
        if(fileType(filename) === 'image'){
            return fileUrl
        }
        const resp = await axios.get<string>(fileUrl)
        return resp.data
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

type Props = OwnProps & StateProps & RouteComponentProps<any>

interface OwnProps {
    filename: string
	repoID: string
}

interface StateProps {
    repo: IRepo
    users: {[userID: string]: IUser}
    discussions: {[userID: string]: IDiscussion}
    comments: {[commentID: string]: IComment}
    codeColorScheme?: string | undefined
    backgroundColor?: string
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
	return {
        repo: state.repo.repos[ownProps.repoID],
        users: state.user.users,
        discussions: state.discussion.discussions,
        comments: state.discussion.comments,
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withRouter(ConnectedFileViewer))
