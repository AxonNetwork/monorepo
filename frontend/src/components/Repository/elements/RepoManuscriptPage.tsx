import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { IGlobalState } from 'redux/store'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import autobind from 'utils/autobind'

import { IRepoFile } from 'common'

const FolderButton = () => <span><FolderOpenIcon/></span>
const CustomToolbar = () => (
    <div id="toolbar">
        <span className="ql-formats">
            <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
                <option value="1"></option>
                <option value="2"></option>
                <option selected></option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
            <button className="ql-blockquote"></button>
        </span>
        <span className="ql-formats">
            <button className="ql-file">
                <FolderButton />
            </button>
            <button className="ql-image"></button>
            <button className="ql-link"></button>
            <button className="ql-formula"></button>
        </span>
        <span className="ql-formats">
            <button className="ql-clean"></button>
        </span>
    </div>
)

@autobind
class RepoManuscriptPage extends React.Component<Props, State>
{
    quill=React.createRef<ReactQuill>()

    state={
        text: '',
        options: [],
        type: '',
        cb: (_: string)=>{}
    }

    modules= {
        toolbar: {
            container: '#toolbar',
            handlers: {
                'image': ()=>this.imageHandler(this.props.files, this.setState),
                'file': ()=>this.fileHandler()
            }
        }
    }

    imageHandler(_: {[name: string]:IRepoFile}, setState: Function){
        setState({
            type: 'image',
            options: ['one', 'two', 'three']
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
            const text = "@file:["+file+"]"
            quill.insertText(cursor, text)
            const newCursor = cursor + text.length + 1
            quill.setSelection(newCursor, 0)
        }
        this.setState({
            type: 'file',
            options: Object.keys(this.props.files),
            cb: cb
        })
    }

    handleClose(option: string){
        this.state.cb(option)
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
        return (
            <div className={classes.editorPage}>
                <div className={classes.editor} id="editor-parent">
                    <CustomToolbar />
                    <ReactQuill
                        className={classes.quill}
                        defaultValue={this.state.text}
                        modules={this.modules}
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
    classes: any
}

interface State {
    text: string
    options: string[]
    type: string
    cb: Function
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
    }
})

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ""
    const files = state.repository.repos[selected].files || {}
    return {
        files: files
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(RepoManuscriptPage))