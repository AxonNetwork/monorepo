import omit from 'lodash/omit'
import pickBy from 'lodash/pickBy'
import fromPairs from 'lodash/fromPairs'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { InputProps } from '@material-ui/core/Input'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import FormattingHelp from '../FormattingHelp'
import { fetchRepoFiles } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { getRepoID } from '../env-specific'
import { IDiscussion, IRepoFile, URI } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'


@autobind
class SmartTextarea extends React.Component<Props, State>
{
    state = {
        anchorEl: null,
        embedType: null,
        position: 0,
        textareaScrollTop: 0,
    }

    _inputTextarea: HTMLTextAreaElement | null = null

    focus() {
        if (this._inputTextarea) {
            this._inputTextarea.focus()
        }
    }

    setSelectionRange = (start: number, end: number) => {
        if (this._inputTextarea) {
            this._inputTextarea.setSelectionRange(start, end)
        }
    }

    // handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
    //     if (event.key === 'Enter' && event.shiftKey && !!this.props.onSubmit) {
    //         this.props.onSubmit()
    //         return
    //     }
    // }

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const text = event.target.value
        const cursor = event.target.selectionStart

        let lastToken = ''
        for (let i = cursor - 1; i >= 0; i--) {
            if (text[i] === ' ' || text[i] === '\n' || text[i] === '\r' || text[i] === '\t') {
                break
            } else {
                lastToken = text[i] + lastToken
            }
        }

        if (lastToken === '@file' || lastToken === '@image') {
            this.props.fetchRepoFiles({ uri: this.props.uri })
        }

        const anchorEl = event.target
        const textareaScrollTop = this._inputTextarea ? this._inputTextarea.scrollTop : 0

        if (lastToken === '@file') {
            this.setState({
                anchorEl,
                position: cursor - 5,
                embedType: '@file',
                textareaScrollTop,
            })
        } else if (lastToken === '@image') {
            this.setState({
                anchorEl,
                position: cursor - 6,
                embedType: '@image',
                textareaScrollTop,
            })
        } else if (lastToken === '@discussion') {
            this.setState({
                anchorEl,
                position: cursor - 11,
                embedType: '@discussion',
                textareaScrollTop,
            })
        } else {
            this.setState({
                anchorEl: null,
                position: 0,
                embedType: null,
                textareaScrollTop: 0,
            })
        }

        this.props.onChange(event.target.value)
    }

    handleClose(embedType?: string, refTarget?: string) {
        const { textareaScrollTop } = this.state

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
        let value = this.props.value
        value = value.substring(0, position) + ref + value.substring(position + embedType.length)

        this.props.onChange(value)

        setTimeout(() => {
            this._inputTextarea.setSelectionRange(position + ref.length, position + ref.length)
            this._inputTextarea.scrollTop = textareaScrollTop
        }, 0)
    }

    render() {
        const { files, classes } = this.props
        const fileNames = Object.keys(files || {}).sort()
        const discussions = fromPairs((this.props.discussionIDs || []).map(discussionID => [discussionID, this.props.discussions[discussionID]]))

        let menuContent: any = null
        let emptyMessage: string | null = null
        if (this.state.embedType === '@file') {
            emptyMessage = 'No files in this repository'
            menuContent = fileNames.map(filename => (
                <MenuItem
                    onClick={() => this.handleClose('@file', this.props.currentHEADCommit + ':' + filename)}
                    classes={{ root: classes.menuItem }}
                >
                    {filename}
                </MenuItem>
            ))

        } else if (this.state.embedType === '@image') {
            emptyMessage = 'No images in this repository'
            menuContent = fileNames.filter(filename => filetypes.getType(filename) === 'image').map(filename => (
                <MenuItem
                    onClick={() => this.handleClose('@image', this.props.currentHEADCommit + ':' + filename)}
                    classes={{ root: classes.menuItem }}
                >
                    {filename}
                </MenuItem>
            ))

        } else if (this.state.embedType === '@discussion') {
            emptyMessage = 'No discussions in this repository'
            menuContent = Object.keys(discussions).map(discussionID => (
                <MenuItem
                    onClick={() => this.handleClose('@discussion', discussionID)}
                    classes={{ root: classes.menuItem }}
                >
                    {discussions[discussionID].subject}
                </MenuItem>
            ))
        }

        if (menuContent !== null && menuContent.length === 0) {
            menuContent = (
                <MenuItem classes={{ root: classes.menuItem }} disabled>
                    {emptyMessage}
                </MenuItem>
            )
        }

        const rowsMax = this.props.rowsMax === false ? undefined : (this.props.rowsMax || 8)

        return (
            <div className={classes.root}>
                <TextField
                    value={this.props.value}
                    placeholder={this.props.placeholder}
                    fullWidth
                    multiline
                    variant={this.props.variant || 'standard'}
                    rows={this.props.rows || 3}
                    rowsMax={rowsMax}
                    onChange={this.handleChange}
                    onKeyUp={/*this.handleKeyPress*/ undefined}
                    className={classes.textField}
                    classes={this.props.textFieldClasses}
                    inputRef={x => this._inputTextarea = x}
                    InputProps={this.props.InputProps}
                />
                <FormattingHelp />

                <Menu
                    anchorEl={this.state.anchorEl}
                    open={this.state.embedType !== null}
                    onClose={() => this.handleClose()}
                >
                    {menuContent}
                </Menu>
            </div>
        )
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
    onChange: (value: string) => void
    onSubmit?: () => void
    value?: string
    rows?: number
    rowsMax?: number|false
    placeholder?: string
    variant?: 'filled'|'standard'|'outlined'
    InputProps?: InputProps
    textFieldClasses?: any
}

interface StateProps {
    files: { [name: string]: IRepoFile } | undefined
    discussionIDs: string[]
    discussions: { [discussionID: string]: IDiscussion }
    currentHEADCommit: string | undefined
}

interface DispatchProps {
    fetchRepoFiles: typeof fetchRepoFiles
}

interface State {
    comment: string
    anchorEl: any
    position: number
    embedType: string | null
    textareaScrollTop: number
}

const styles = (theme: Theme) => createStyles({
    root: {}, // for overriding
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
    const repoURIStr = uriToString(
        omit(ownProps.uri, 'filename') as URI
    )

    const commitList = state.repo.commitListsByURI[repoURIStr] || []
    const currentHEADCommit = commitList.length > 0 ? commitList[0] : undefined

    return {
        files: state.repo.filesByURI[repoURIStr] ? pickBy(state.repo.filesByURI[repoURIStr], file => file.type !== 'folder') : undefined,
        discussionIDs: state.discussion.discussionsByRepo[repoID],
        discussions: state.discussion.discussions,
        currentHEADCommit,
    }
}

const mapDispatchToProps = {
    fetchRepoFiles,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SmartTextarea))
