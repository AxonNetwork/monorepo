import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import FormattingHelp from '../FormattingHelp'
import { IGlobalState } from '../redux'
import { IDiscussion, IRepo, IRepoFile, URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
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
        comment = comment.substring(0, position) + ref + comment.substring(position + 5)
        this.setState({ comment: comment })
    }

    render() {
        const { files, classes } = this.props
        const fileNames = Object.keys(files || {})

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
                    {this.state.embedType === '@file' && fileNames.map((file: string) => (
                        <MenuItem
                            onClick={() => this.handleClose('@file', file)}
                            classes={{ root: classes.menuItem }}
                        >
                            {file}
                        </MenuItem>
                    ))}
                    {this.state.embedType === '@image' && fileNames.filter(filename => filetypes.getType(filename) === 'image').map(filename => (
                        <MenuItem
                            onClick={() => this.handleClose('@image', filename)}
                            classes={{ root: classes.menuItem }}
                        >
                            {filename}
                        </MenuItem>
                    ))}
                    {this.state.embedType === '@discussion' && Object.keys(this.props.discussions).map((discussionID: string) => (
                        <MenuItem
                            onClick={() => this.handleClose('@discussion', discussionID)}
                            classes={{ root: classes.menuItem }}
                        >
                            {this.props.discussions[discussionID].subject}
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    }
}

interface State {
    comment: string
    anchorEl: any
    position: number
    embedType: string | null
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
    discussions: { [discussionID: string]: IDiscussion }
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
    let repo = undefined as IRepo | undefined
    if (ownProps.uri.type === URIType.Local) {
        repo = state.repo.repos[ownProps.uri.repoRoot]
    } else if (ownProps.uri.type === URIType.Network) {
        repo = state.repo.repos[ownProps.uri.repoID]
    }

    return {
        files: (repo || { files: {} }).files || {},
        discussions: state.discussion.discussions,
    }
}

const mapDispatchToProps = {}

export default connect<StateProps, {}, OwnProps, IGlobalState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SmartTextarea))
