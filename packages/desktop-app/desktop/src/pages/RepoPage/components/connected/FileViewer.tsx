import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router'
import FileViewer from 'conscience-components/FileViewer'
import { IGlobalState } from 'redux/store'
import { IRepo, IComment, IUser, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import fs from 'fs'
import path from 'path'


@autobind
class ConnectedFileViewer extends React.Component<Props>
{
    render() {
        const { repoHash, ...other } = this.props
        const directEmbedPrefix = this.directEmbedPrefix()
        return (
            <FileViewer
                {...other}
                directEmbedPrefix={directEmbedPrefix}
                getFileContents={this.getFileContents}
                selectFile={this.selectFile}
                selectDiscussion={this.selectDiscussion}
            />
        )
    }

    directEmbedPrefix() {
        const path = this.props.repo.path
        const prefix = "file://" + path
        return prefix
    }

    async getFileContents(filename: string) {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path.join(this.props.repo.path || "", filename), 'utf8', (err: Error, contents: string) => {
                if (err) {
                    reject(err)
                }
                resolve(contents)
            })
        })
    }

    selectFile(payload: { filename: string | undefined, mode: FileMode }) {
        const repoHash = this.props.repoHash
        const filename = payload.filename
        if (filename === undefined) {
            this.props.history.push(`/repo/${repoHash}/file`)
        } else {
            this.props.history.push(`/repo/${repoHash}/file/${filename}`)
        }
    }

    selectDiscussion(payload: { discussionID: string | undefined }) {
        const repoHash = this.props.repoHash
        const discussionID = payload.discussionID
        if (discussionID === undefined) {
            this.props.history.push(`/repo/${repoHash}/discussion`)
        } else {
            this.props.history.push(`/repo/${repoHash}/discussion/${discussionID}`)
        }
    }
}

type Props = OwnProps & StateProps & RouteComponentProps<any>

interface OwnProps {
    filename: string
    repoHash: string
    showViewerPicker: boolean
}

interface StateProps {
    repo: IRepo
    users: { [userID: string]: IUser }
    discussions: { [userID: string]: IDiscussion }
    comments: { [commentID: string]: IComment }
    codeColorScheme?: string | undefined
    backgroundColor?: string
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repoRoot = state.repo.reposByHash[ownProps.repoHash]
    return {
        repo: state.repo.repos[repoRoot],
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
