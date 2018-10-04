import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { IGlobalState } from 'redux/store'
import ReactQuill, { Quill } from 'react-quill'
import 'quill/dist/quill.snow.css'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import autobind from 'utils/autobind'
import { CustomToolbar, ImageBlot, FileLink } from './Editor/QuillUtils'
import { IRepoFile } from 'common'
import { selectFile, navigateRepoPage } from 'redux/repository/repoActions'
import { RepoPage } from 'redux/repository/repoReducer'
import { loadTextContent, saveTextContent } from 'redux/editor/editorActions'

@autobind
class RepoEditorPage extends React.Component<Props, State>
{
    quill = React.createRef<ReactQuill>()

    state = {
        text: '',
        saved: true,
        options: [],
        type: '',
        cb: undefined,
    }

    modules = {
        toolbar: {
            container: '#toolbar',
            handlers: {
                'image': () => this.imageHandler(),
                'file': () => this.fileHandler(),
                'save': () => this.saveHandler(),
            }
        }
    }

    constructor(props: Props){
        super(props)
        this.setup(props)
    }

    componentWillReceiveProps(props: Props){
        if(props.content != this.props.content){
            this.setup(props)
        }
    }

    setup(props: Props){
        props.loadTextContent({repoRoot: props.folderPath, file: 'manuscript'})
        this.setState({
            text: props.content,
            saved: true
        })

        ImageBlot.folderPath = this.props.folderPath
        Quill.register(ImageBlot)
        FileLink.onClick=(file: string)=>{
            console.log('selected: ', file)
            // this.props.selectFile({selectedFile:{file: file, isFolder: false}})
            // this.props.navigateRepoPage({ repoPage: RepoPage.Files })
        }
        Quill.register(FileLink)
    }

    imageHandler(){
        const ref = this.quill.current
        if(ref === null) return
        const quill = ref.getEditor()
        const cb = (image: string)=>{
            const selection = quill.getSelection()
            if(selection === null) return
            const cursor = selection.index
            quill.insertEmbed(cursor, 'conscience-image', image)
            quill.setSelection(cursor+1, 0)
        }
        const files = this.props.files
        const images = Object.keys(files).filter(f=>files[f].type==='image')
        this.setState({
            type: 'image',
            options: images,
            cb: cb
        })
    }

    fileHandler(){
        const ref = this.quill.current
        if(ref === null) return
        const quill = ref.getEditor()
        const cb = (file: string)=>{
            const selection = quill.getSelection()
            if(selection === null) return
            const cursor = selection.index
            quill.insertText(cursor, file, 'conscience-file', file)
            quill.setSelection(cursor + file.length + 2, 0)
        }
        this.setState({
            type: 'file',
            options: Object.keys(this.props.files),
            cb: cb
        })
    }

    saveHandler(){
        this.props.saveTextContent({
            repoRoot: this.props.folderPath,
            file: 'manuscript',
            content: this.state.text
        })
        this.setState({
            saved: true
        })
    }

    handleKeyPress(event: React.KeyboardEvent){
        if(event.key === 's' && event.ctrlKey){
            this.saveHandler()
        }
    }

    handleClose(option: string){
        const cb = this.state.cb as Function|undefined
        if(cb !== undefined && option.length > 0){
            cb(option)
        }

        this.setState({
            type: '',
            options: [],
            cb: (_: string)=>{}
        })
    }

    handleChange(value: string) {
        this.setState({
            text: value,
            saved: false
        })
    }

    render() {
        const { loaded, classes } = this.props
        if(!loaded){
            return <div></div>
        }

        return (
            <div className={classes.editorPage}>
                <div className={classes.editor} id="editor-parent">
                    <CustomToolbar />
                    <ReactQuill
                        className={classes.quill}
                        defaultValue={this.state.text}
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
                <Dialog onClose={()=>this.handleClose("")} open={this.state.options.length > 0}>
                    <DialogTitle id="simple-dialog-title">
                        {this.state.type==='file' && <span>Select File</span>}
                        {this.state.type==='image' && <span>Select Image</span>}
                    </DialogTitle>
                    <div>
                        <List>
                            {this.state.options.map((option: string) => (
                                <ListItem button onClick={() => this.handleClose(option)} key={option}>
                                    <ListItemText primary={option} />
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Dialog>
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
    navigateRepoPage: typeof navigateRepoPage
    loadTextContent: typeof loadTextContent
    saveTextContent: typeof saveTextContent
    classes: any
}

interface State {
    text: string
    saved: boolean
    options: string[]
    type: string
    cb?: Function
}

const styles = (theme: Theme) => createStyles({
    editor:{
        height: '100%',
        width: '60%',
        position: 'relative'
    },
    quill:{
        height: '100%',

        '& > .ql-container': {
            height: '90%',
            overflowY: 'scroll'
        },
    },
    menuItem:{
        maxWidth: 300
    },
    imageBlot:{
        width: '50%',
        margin: '0 auto'
    },
    fileLink: {
        // override quilljs
        color: theme.palette.secondary.main + "!important"
    },
    saveIndicator: {
        width: 12,
        height: 12,
        backgroundColor: theme.palette.secondary.main,
        borderRadius: "50%",
        position: 'absolute',
        top: 8,
        right: 8,
    }
})

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ""
    const files = state.repository.repos[selected].files || {}
    const folderPath = state.repository.repos[selected].path || ""
    const content = (state.editor.content[selected]||{})['manuscript']
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
    navigateRepoPage,
    loadTextContent,
    saveTextContent
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(RepoEditorPage))