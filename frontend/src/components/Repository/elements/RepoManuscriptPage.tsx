import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
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
import { selectFile } from 'redux/repository/repoActions'


@autobind
class RepoManuscriptPage extends React.Component<Props, State>
{
    quill=React.createRef<ReactQuill>()

    state={
        text: '',
        options: [],
        type: '',
        cb: undefined
    }

    modules= {
        toolbar: {
            container: '#toolbar',
            handlers: {
                'image': ()=>this.imageHandler(),
                'file': ()=>this.fileHandler()
            }
        }
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
        console.log(quill)
        const cb = (file: string)=>{
            const selection = quill.getSelection()
            if(selection === null) return
            const cursor = selection.index
            quill.insertEmbed(cursor, 'conscience-file', file)
            quill.setSelection(cursor+file.length+1, 0)
            // const text = "@file:["+file+"]"
            // quill.insertText(cursor, file, 'file')
            // quill.insertText(cursor, file, 'file', file)
            // const newCursor = cursor + text.length + 1
            // quill.setSelection(newCursor, 0)
        }
        this.setState({
            type: 'file',
            options: Object.keys(this.props.files),
            cb: cb
        })
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
        this.setState({ text: value })
    }

    render() {
        const { classes } = this.props
        ImageBlot.folderPath = this.props.folderPath
        ImageBlot.className = classes.imageBlot
        Quill.register(ImageBlot)
        FileLink.onClick=(file: string)=>{
            this.props.selectFile({selectedFile:{file: file, isFolder: false}})
            this.props.switchToPage('files')
        }
        Quill.register(FileLink)

        return (
            <div className={classes.editorPage}>
                <div className={classes.editor} id="editor-parent">
                    <CustomToolbar />
                    <ReactQuill
                        className={classes.quill}
                        defaultValue={this.state.text}
                        modules={this.modules}
                        // formats={formats}
                        onChange={this.handleChange}
                        bounds="#editor-parent"
                        ref={this.quill}
                    />
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
    selectFile: Function
    switchToPage: Function
    classes: any
}

interface State {
    text: string
    options: string[]
    type: string
    cb?: Function
}

const styles = createStyles({
    editor:{
        height: '100%',
        width: '60%',
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
    }
})

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ""
    const files = state.repository.repos[selected].files || {}
    const folderPath = state.repository.repos[selected].path || ""
    return {
        files: files,
        folderPath: folderPath
    }
}

const mapDispatchToProps = {
    selectFile
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(RepoManuscriptPage))