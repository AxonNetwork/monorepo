import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { IGlobalState } from 'redux/store'
import ReactQuill, { Quill } from 'react-quill'
import 'quill/dist/quill.snow.css'
import autobind from 'utils/autobind'
import { CustomToolbar, ImageBlot, FileLink } from './Editor/QuillUtils'
import { IRepoFile } from 'common'
import { selectFile } from 'redux/repository/repoActions'
import { loadTextContent, saveTextContent } from 'redux/editor/editorActions'
import EditorSidebar from './Editor/EditorSidebar'

@autobind
class RepoEditorPage extends React.Component<Props, State>
{
    quill = React.createRef<ReactQuill>()

    state = {
        text: '',
        saved: true,
        options: [],
        type: '',
        cb: (_: string) => {},
    }

    modules = {
        toolbar: {
            container: '#toolbar',
            handlers: {
                image: () => this.imageHandler(),
                file: () => this.fileHandler(),
                save: () => this.saveHandler(),
            },
        },
    }

    constructor(props: Props) {
        super(props)
        this.setup(props)
    }

    componentWillReceiveProps(props: Props) {
        if (props.content != this.props.content || props.folderPath != this.props.folderPath) {
            this.setup(props)
        }
        if (this.state.text.length === 0 && props.content.length > 0) {
            this.setState({text: props.content})
        }
    }

    setup(props: Props) {
        props.loadTextContent({repoRoot: props.folderPath, filename: 'manuscript'})
        this.setState({
            text: props.content,
            saved: true,
        })

        ImageBlot.folderPath = this.props.folderPath
        Quill.register(ImageBlot)
        FileLink.onClick = (file: string) => {
            console.log('selected: ', file)
        }
        Quill.register(FileLink)
    }

    imageHandler() {
        const ref = this.quill.current
        if (ref === null) { return }
        const quill = ref.getEditor()
        const cb = (image: string) => {
            const selection = quill.getSelection()
            if (selection === null) { return }
            const cursor = selection.index
            quill.insertEmbed(cursor, 'conscience-image', image)
            quill.setSelection(cursor + 1, 0)
        }
        const files = this.props.files
        const images = Object.keys(files).filter(f => files[f].type === 'image')
        this.setState({
            type: 'Images',
            options: images,
            cb: cb,
        })
    }

    fileHandler() {
        const ref = this.quill.current
        if (ref === null) { return }
        const quill = ref.getEditor()
        const cb = (file: string) => {
            const selection = quill.getSelection()
            if (selection === null) { return }
            const cursor = selection.index
            quill.insertText(cursor, file, 'conscience-file', file)
            quill.setSelection(cursor + file.length + 1, 0)
        }
        this.setState({
            type: 'Files',
            options: Object.keys(this.props.files),
            cb: cb,
        })
    }

    saveHandler() {
        this.props.saveTextContent({
            repoRoot: this.props.folderPath,
            file: 'manuscript',
            content: this.state.text,
        })
        this.setState({
            saved: true,
        })
    }

    handleKeyPress(event: React.KeyboardEvent) {
        if (event.key === 's' && event.ctrlKey) {
            this.saveHandler()
        }
    }

    handleChange(value: string) {
        const saved = value == this.props.content
        this.setState({
            text: value,
            saved: saved,
        })
    }

    closeSidebar() {
        this.setState({
            type: '',
            options: [],
            cb: (_: string) => {},
        })
    }

    render() {
        const { loaded, classes } = this.props
        if (!loaded) {
            return <div></div>
        }

        return (
            <div className={classes.editorPage}>
                <div className={classes.editor} id="editor-parent">
                    <CustomToolbar />
                    <ReactQuill
                        className={classes.quill}
                        defaultValue={this.props.content}
                        modules={this.modules}
                        onChange={this.handleChange}
                        onKeyUp={this.handleKeyPress}
                        bounds="#editor-parent"
                        ref={this.quill}
                    />
                    {!this.state.saved &&
                        <div className={classes.saveIndicator} />
                    }
                </div>
                <EditorSidebar
                    type={this.state.type}
                    options={this.state.options}
                    onInsert={this.state.cb}
                    onClose={this.closeSidebar}
                />
            </div>
        )
    }
}

interface Props {
    files: {[name: string]: IRepoFile}
    folderPath: string
    content: string
    loaded: boolean
    selectFile: typeof selectFile
    loadTextContent: typeof loadTextContent
    saveTextContent: typeof saveTextContent
    classes: any
}

interface State {
    text: string
    saved: boolean
    options: string[]
    type: string
    cb: Function
}

const styles = (theme: Theme) => createStyles({
    editorPage: {
        display: 'flex',
        paddingRight: theme.spacing.unit,
    },
    editor: {
        height: '100%',
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 40,
    },
    quill: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        overflowY: 'auto',

        '& > .ql-container': {
            // height: '100%',
            width: '100%',
            flexGrow: 1,
        },
    },
    menuItem: {
        maxWidth: 300,
    },
    imageBlot: {
        width: '50%',
        margin: '0 auto',
    },
    fileLink: {
        // override quilljs
        color: theme.palette.secondary.main + '!important',
    },
    saveIndicator: {
        width: 12,
        height: 12,
        backgroundColor: theme.palette.secondary.main,
        borderRadius: '50%',
        position: 'absolute',
        top: 8,
        right: 8,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const files = state.repository.repos[selected].files || {}
    const folderPath = state.repository.repos[selected].path || ''
    const content = (state.editor.content[selected] || {})['manuscript'] || ''
    const loaded = state.editor.loaded
    return {
        files: files,
        folderPath: folderPath,
        content: content,
        loaded: loaded,
    }
}

const mapDispatchToProps = {
    selectFile,
    loadTextContent,
    saveTextContent,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoEditorPage))