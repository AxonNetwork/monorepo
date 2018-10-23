import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
// import { IGlobalState } from 'redux/store'
import Button from '@material-ui/core/Button'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import Breadcrumbs from 'components/Repository/elements/FileList/Breadcrumbs'
import { selectFile } from 'redux/repository/repoActions'
import autobind from 'utils/autobind'
import fs from 'fs'
import path from 'path'


@autobind
class MarkdownEditor extends React.Component<Props, State>
{
    state = {
        loading: true,
        contents: '',
        contentsOnDisk: '',
        fileExistsOnDisk: false,
        error: undefined,
    }

    _inputText: HTMLTextAreaElement | null = null

    render() {
        const { filename, classes } = this.props

        if (this.state.loading) {
            return <div className={classes.root}>Loading...</div>
        }

        const modified = this.state.contentsOnDisk !== this.state.contents

        return (
            <div className={classes.root}>
                <Breadcrumbs
                    repoRoot={this.props.repoRoot}
                    selectedFolder={filename}
                    classes={{ root: classes.breadcrumbs }}
                />

                <div className={classes.toolbar}>
                    <div className={classes.toolbarSpacer}></div>
                    <div>{modified ? 'modified' : null}</div>
                    <Button onClick={this.onClickSave} color="secondary">Save</Button>
                    <Button onClick={this.onClickClose} color="secondary">Close</Button>
                </div>

                <div className={classes.columnContainer}>
                    <div className={classes.textareaWrapper}>
                        <textarea
                            defaultValue={this.props.defaultContents || this.state.contents}
                            onChange={this.onChangeText}
                            ref={x => this._inputText = x}
                        />
                    </div>

                    <div className={classes.renderedWrapper}>
                        <RenderMarkdown
                            text={this.state.contents}
                            basePath={this.props.repoRoot || ''}
                        />
                    </div>
                </div>
            </div>
        )
    }

    onClickSave() {
        fs.writeFile(path.join(this.props.repoRoot, this.props.filename), this.state.contents, { encoding: 'utf8' }, (err) => {
            if (err) {
                console.error('error saving ~>', err)
                return
            }
            this.setState({ contentsOnDisk: this.state.contents })
        })
    }

    onClickClose() {
        if (this.state.fileExistsOnDisk) {
            this.props.selectFile({ selectedFile: { file: this.props.filename, isFolder: false, editing: false } })
        } else {
            const dir = path.dirname(this.props.filename)
            if (dir === '.') {
                this.props.selectFile({ selectedFile: undefined })
            } else {
                this.props.selectFile({ selectedFile: { file: dir, isFolder: true, editing: false } })
            }
        }
    }

    onChangeText() {
        if (!this._inputText) {
            return
        }
        this.setState({ contents: this._inputText.value })
    }

    componentDidMount() {
        fs.readFile(path.join(this.props.repoRoot, this.props.filename), 'utf8', (err: Error, contents: string) => {
            if (err) {
                // @@TODO: display error in UI
                console.error('error loading ~>', err)
                this.setState({
                    loading: false,
                    contents: this.props.defaultContents || '',
                    contentsOnDisk: '',
                    fileExistsOnDisk: false,
                    error: err,
                })
                return
            }

            this.setState({
                loading: false,
                contents: this.props.defaultContents || contents,
                contentsOnDisk: contents,
                fileExistsOnDisk: true,
                error: undefined,
            })
        })
    }
}

interface Props {
    repoRoot: string
    filename: string
    defaultContents?: string

    selectFile: typeof selectFile

    classes: any
}

interface State {
    loading: boolean
    contents: string
    contentsOnDisk: string
    fileExistsOnDisk: boolean
    error: Error | undefined
}

const styles = (theme: Theme) => createStyles({
    root: {
        height: '100%',
        paddingBottom: 30,
    },
    toolbar: {
        display: 'flex',
    },
    toolbarSpacer: {
        flexGrow: 1,
    },
    columnContainer: {
        display: 'flex',
        height: '100%',
    },
    textareaWrapper: {
        flexGrow: 1,
        marginRight: 30,
        maxWidth: 520,
        width: '50%',

        '& textarea': {
            width: '100%',
            height: '100%',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.9rem',
        },
    },
    renderedWrapper: {
        flexGrow: 1,
        width: '50%',
    },
})

// const mapStateToProps = (state: IGlobalState) => {
//     const selected = state.repository.selectedRepo || ''
//     const repoRoot = state.repository.repos[selected].path || ''
//     return {
//         repoRoot,
//         filename: ,
//     }
// }

const mapDispatchToProps = {
    selectFile,
}

export default connect(
    null,
    mapDispatchToProps,
)(withStyles(styles)(MarkdownEditor))

// export default withStyles(styles)(MarkdownEditor)


