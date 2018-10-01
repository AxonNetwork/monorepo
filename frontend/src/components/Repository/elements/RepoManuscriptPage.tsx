import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { IGlobalState } from 'redux/store'
import ReactQuill from 'react-quill'
import 'quill/dist/quill.snow.css'
import autobind from 'utils/autobind'

function linkHandler(_ : boolean){
    // if(val){
    //     (this as any).quill.format('link', 'http://conscience.network')
    // }
}

@autobind
class RepoManuscriptPage extends React.Component<Props, State>
{
    state={
        text: '',
    }

    modules= {
        toolbar: {
            container:[
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline','strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                'link': linkHandler
            }
        }
    }

    handleChange(value: string) {
        this.setState({ text: value })
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.editorPage}>
                <div className={classes.editor}>
                    <ReactQuill
                        className={classes.quill}
                        value={this.state.text}
                        modules={this.modules}
                        onChange={this.handleChange}
                    />
                </div>
            </div>
        )
    }
}

interface Props {
    classes: any
}

interface State {
    text: string
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
    }
})

const mapStateToProps = (_: IGlobalState) => {
    return {}
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(RepoManuscriptPage))