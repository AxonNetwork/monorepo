import fromPairs from 'lodash/fromPairs'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import FormattingHelp from '../FormattingHelp'
import { IGlobalState } from '../redux'
import { getRepoID } from '../env-specific'
import { IDiscussion, IRepoFile, URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'


@autobind
class SmartTextarea extends React.Component<Props, State>
{
    state = {
        comment: '',
        anchorEl: null,
        embedType: null,
        position: 0,
    }

    _inputTextarea: HTMLTextAreaElement | null = null

    getValue() {
        return this.state.comment
    }

    setValue(value: string) {
        this.setState({ comment: value })
    }

    focus() {
        if (this._inputTextarea) {
            this._inputTextarea.focus()
        }
    }

    handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter' && event.shiftKey) {
            this.props.onSubmit()
            return
        }
    }

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const text = event.target.value
        const cursor = event.target.selectionStart

        let lastToken = ''
        for (let i = text.length - 1; i >= 0; i--) {
            if (text[i] === ' ') {
                break
            } else {
                lastToken = text[i] + lastToken
            }
        }

        if (lastToken === '@file') {
            this.setState({
                anchorEl: event.target,
                comment: event.target.value,
                position: cursor - 5,
                embedType: '@file',
            })
        } else if (lastToken === '@image') {
            this.setState({
                anchorEl: event.target,
                comment: event.target.value,
                position: cursor - 6,
                embedType: '@image',
            })
        } else if (lastToken === '@discussion') {
            this.setState({
                anchorEl: event.target,
                comment: event.target.value,
                position: cursor - 11,
                embedType: '@discussion',
            })
        } else {
            this.setState({
                anchorEl: null,
                comment: event.target.value,
                position: 0,
                embedType: null,
            })
        }
    }

    handleClose(embedType?: string, refTarget?: string) {
        this.setState({
            anchorEl: null,
            position: 0,
            embedType: null,
        })
        if (embedType === undefined || refTarget === undefined) {
            return
        }
        const ref = embedType + ':[' + refTarget + '] '
        const position = this.state.position
        let comment = this.state.comment
        comment = comment.substring(0, position) + ref + comment.substring(position + embedType.length)
        this.setState({ comment: comment })
    }

    render() {
        const { files, classes } = this.props
        const fileNames = Object.keys(files || {}).sort()
        const discussions = fromPairs(this.props.discussionIDs.map(discussionID => [discussionID, this.props.discussions[discussionID]]))

        return (
            <div>
                <TextField
                    value={this.state.comment}
                    placeholder={this.props.placeholder}
                    fullWidth
                    multiline
                    rows={this.props.rows || 3}
                    rowsMax={this.props.rowsMax || 8}
                    onChange={this.handleChange}
                    onKeyUp={this.handleKeyPress}
                    className={classes.textField}
                    inputRef={x => this._inputTextarea = x}
                />
                <FormattingHelp />

                <Menu
                    anchorEl={this.state.anchorEl}
                    open={this.state.embedType !== null}
                    onClose={() => this.handleClose()}
                >
                    {this.state.embedType === '@file' && fileNames.map(filename => (
                        <MenuItem
                            onClick={() => this.handleClose('@file', this.props.currentHEADCommit + ':' + filename)}
                            classes={{ root: classes.menuItem }}
                        >
                            {filename}
                        </MenuItem>
                    ))}
                    {this.state.embedType === '@image' && fileNames.filter(filename => filetypes.getType(filename) === 'image').map(filename => (
                        <MenuItem
                            onClick={() => this.handleClose('@image', this.props.currentHEADCommit + ':' + filename)}
                            classes={{ root: classes.menuItem }}
                        >
                            {filename}
                        </MenuItem>
                    ))}
                    {this.state.embedType === '@discussion' && Object.keys(discussions).map(discussionID => (
                        <MenuItem
                            onClick={() => this.handleClose('@discussion', discussionID)}
                            classes={{ root: classes.menuItem }}
                        >
                            {discussions[discussionID].subject}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    onSubmit: () => void

    rows?: number
    rowsMax?: number
    placeholder?: string
}

interface StateProps {
    files: { [name: string]: IRepoFile } | undefined
    discussionIDs: string[]
    discussions: { [discussionID: string]: IDiscussion }
    currentHEADCommit: string | undefined
}

interface State {
    comment: string
    anchorEl: any
    position: number
    embedType: string | null
}

const styles = (theme: Theme) => createStyles({
    textField: {
        flexGrow: 1,
        padding: theme.spacing.unit,
        minHeight: 64,
    },
    submit: {
        padding: theme.spacing.unit,
        borderRadius: 4,
    },
    icon: {
        color: theme.palette.grey[700],
    },
    menuItem: {
        maxWidth: 300,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repoID = getRepoID(ownProps.uri)
    const uriStr = uriToString(ownProps.uri)

    const commitList = state.repo.commitListsByURI[uriStr] || []
    const currentHEADCommit = commitList.length > 0 ? commitList[0] : undefined

    return {
        files: state.repo.filesByURI[uriStr],
        discussionIDs: state.discussion.discussionsByRepo[repoID],
        discussions: state.discussion.discussions,
        currentHEADCommit,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SmartTextarea))
