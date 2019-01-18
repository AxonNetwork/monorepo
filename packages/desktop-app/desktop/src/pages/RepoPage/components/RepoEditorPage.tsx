import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import MarkdownEditor from 'conscience-components/MarkdownEditor'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser, IComment, IDiscussion, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import fs from 'fs'
import path from 'path'


@autobind
class RepoEditorPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        const directEmbedPrefix = this.directEmbedPrefix()
        return (
            <div className={classes.page}>
                <MarkdownEditor
                    repo={this.props.repo}
                    filename={this.props.match.params.filename}
                    comments={this.props.comments}
                    users={this.props.users}
                    discussions={this.props.discussions}
                    directEmbedPrefix={directEmbedPrefix}
                    codeColorScheme={this.props.codeColorScheme}
                    getFileContents={this.getFileContents}
                    selectFile={this.selectFile}
                    selectDiscussion={this.selectDiscussion}
                    saveFileContents={this.saveFileContents}
                />
            </div>
        )
    }

    directEmbedPrefix() {
        const path = this.props.repo.path
        const prefix = "file://" + path
        return prefix
    }

    async getFileContents(filename: string) {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path.join(this.props.repo.path || "", filename), 'utf8', (err?: Error, contents: string) => {
                if (err) {
                    reject(err)
                }
                resolve(contents)
            })
        })
    }

    async saveFileContents(payload: { contents: string, repoID: string, filename: string }) {
        return new Promise<string>((resolve, reject) => {
            fs.writeFile(path.join(this.props.repo.path || "", payload.filename), payload.contents, 'utf8', (err?: Error) => {
                if (err) {
                    reject(err)
                }
                resolve({})
            })
        })
    }

    selectFile(payload: { filename: string | undefined, mode: FileMode }) {
        console.log('here')
        console.log(payload)
        const repoHash = this.props.match.params.repoHash
        const { filename, mode } = payload
        if (filename === undefined) {
            this.props.history.push(`/repo/${repoHash}/files`)
        } else if (mode === FileMode.View) {
            this.props.history.push(`/repo/${repoHash}/files/${filename}`)
        } else {
            this.props.history.push(`/repo/${repoHash}/edit/${filename}`)
        }
    }

    selectDiscussion(payload: { discussionID: string | undefined }) {
        const repoHash = this.props.match.params.repoHash
        const discussionID = payload.discussionID
        if (discussionID === undefined) {
            this.props.history.push(`/repo/${repoHash}/discussion`)
        } else {
            this.props.history.push(`/repo/${repoHash}/discussion/${discussionID}`)
        }
    }
}


type Props = StateProps & DispatchProps & OwnProps & { classes: any }

interface MatchParams {
    filename: string
    repoHash: string
}

interface OwnProps extends RouteComponentProps<MatchParams> { }

interface StateProps {
    repo: IRepo
    users: { [userID: string]: IUser }
    discussions: { [userID: string]: IDiscussion }
    comments: { [commentID: string]: IComment }
    codeColorScheme?: string | undefined
}

interface DispatchProps { }

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

const mapStateToProps = (state: IGlobalState, props: OwnProps) => {
    const repoRoot = state.repo.reposByHash[props.match.params.repoHash]
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
)(withStyles(styles)(RepoEditorPage))
