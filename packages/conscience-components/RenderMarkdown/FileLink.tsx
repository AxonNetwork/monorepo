import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import FileViewer from '../FileViewer'
import { IRepo, IUser, IDiscussion, IComment, FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'

@autobind
class FileLink extends React.Component<Props, State> {
    state = {
        showPopper: false,
    }

    _link: HTMLAnchorElement | null = null

    render() {
        const { filename, repo, classes } = this.props
        const boundariesElement = document.getElementById('hihihi') // @@TODO: either pass ref via props, or rename div ID to something sane
        return (
            <React.Fragment>
                <a
                    className={classes.link}
                    onClick={this.goToFile}
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    ref={x => this._link = x}
                >
                    {filename}
                </a>
                <Popper
                    open={this.state.showPopper}
                    anchorEl={this._link}
                    placement="top"
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    popperOptions={{
                        modifiers: {
                            preventOverflow: { enabled: true, boundariesElement },
                        },
                    }}
                    className={classes.popper}
                >
                    <FileViewer
                        filename={this.props.filename}
                        directEmbedPrefix={this.props.directEmbedPrefix}
                        showViewerPicker={false}
                        repo={repo}
                        comments={this.props.comments}
                        users={this.props.users}
                        discussions={this.props.discussions}
                        codeColorScheme={this.props.codeColorScheme}
                        getFileContents={this.props.getFileContents}
                        selectFile={this.props.selectFile}
                        selectDiscussion={this.props.selectDiscussion}
                        classes={{ codeContainer: classes.codeContainer }}
                    />
                </Popper>
            </React.Fragment>
        )
    }

    goToFile() {
        const filename = this.props.filename
        this.props.selectFile({ filename, mode: FileMode.View })
    }

    showPopper() {
        this.setState({ showPopper: true })
    }

    hidePopper() {
        this.setState({ showPopper: false })
    }
}

interface Props {
    filename: string
    directEmbedPrefix: string
    repo: IRepo
    comments: { [commentID: string]: IComment }
    users: { [userID: string]: IUser }
    discussions: { [userID: string]: IDiscussion }
    codeColorScheme?: string | undefined
    getFileContents: (filename: string) => Promise<string>
    selectFile: (payload: { filename: string | undefined; mode: FileMode }) => void
    selectDiscussion: (payload: { discussionID: string | undefined }) => void
    classes: any
}

interface State {
    showPopper: boolean
}

const styles = (theme: Theme) => createStyles({
    link: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    popper: {
        maxWidth: '50%',
        maxHeight: '50%',
        backgroundColor: theme.palette.background.default,
        border: '1px solid',
        borderColor: theme.palette.grey[400],
        overflow: 'auto',
        zIndex: 10,
        boxShadow: '1px 1px 6px #00000021',
    },
    codeContainer: {
        overflowX: 'unset',
    },
})

export default withStyles(styles)(FileLink)
