import path from 'path'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import autobind from 'utils/autobind'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import { IRepoFile } from 'common'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco, railscasts, zenburn, androidstudio, rainbow, atomOneDark } from 'react-syntax-highlighter/styles/hljs'
const fs = (window as any).require('fs')
const schemes = require('react-syntax-highlighter/styles/hljs')

const codeColorSchemes = [
    'railscasts',
    'zenburn',
    'androidstudio',
    'rainbow',
    'atom-one-dark',
]

console.log('schemes ~>', schemes)

@autobind
class FileViewer extends React.Component<Props, State>
{
    state = { fileContents: '', error: undefined, codeColorScheme: Object.keys(schemes)[0] }

    render() {
        const { file, classes } = this.props
        const extension = path.extname(file.name).toLowerCase()

        switch (extension) {
        case '.md':
            return <RenderMarkdown text={this.state.fileContents || ''} basePath={this.props.repoRoot} />
        case '.jpg':
            return <img src={'file://' + path.join(this.props.repoRoot, file.name)} className={classes.imageEmbed} />
        case '.go':
            const syntaxStyle = { padding: 0, margin: 0, background: 'none' }
            const codeTagProps = { style: { fontFamily: "Consolas, Monaco, 'Courier New', sans-serif", fontWeight: 500, fontSize: '0.7rem' } }
            let color
            return (
                <div>
                    <Select onChange={this.onChangeCodeColorScheme} value={this.state.codeColorScheme}>
                        {Object.keys(schemes).map(scheme => (
                            <MenuItem value={scheme}>{scheme}</MenuItem>
                        ))}
                    </Select>
                    <div className={classes.codeContainer} style={{ backgroundColor: (schemes[this.state.codeColorScheme].hljs || {}).background }}>
                        <SyntaxHighlighter style={schemes[this.state.codeColorScheme]} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                            {this.state.fileContents || ''}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )
        default:
            return <div>We don't have a viewer for this kind of file yet.</div>
        }
    }

    onChangeCodeColorScheme(evt: any) {
        console.log('evt ~>', evt, evt.target.value)
        this.setState({ codeColorScheme: evt.target.value })
    }

    componentDidMount() {
        if (this.isTextFile(this.props.file.name)) {
            fs.readFile(path.join(this.props.repoRoot, this.props.file.name), 'utf8', (err: Error, contents: string) => {
                if (err) {
                    // @@TODO: display error in UI
                    console.error(err)
                    this.setState({ fileContents: '', error: err })
                    return
                }
                this.setState({ fileContents: contents })
            })
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.file.name !== this.props.file.name && this.isTextFile(this.props.file.name)) {
            fs.readFile(path.join(this.props.repoRoot, this.props.file.name), 'utf8', (err: Error, contents: string) => {
                if (err) {
                    // @@TODO: display error in UI
                    console.error(err)
                    this.setState({ fileContents: '', error: err })
                    return
                }
                this.setState({ fileContents: contents })
            })
        }
    }

    isTextFile(filename: string) {
        const extension = path.extname(filename).toLowerCase()
        return [
            '.md',
            '.txt',
            '.js',
            '.py',
            '.go',
        ].includes(extension)
    }
}

interface Props {
    file: IRepoFile
    repoRoot: string
    classes: any
}

interface State {
    fileContents: string
    error: Error | undefined
    codeColorScheme: string
}

const styles = () => createStyles({
    imageEmbed: {
        maxWidth: '100%',
    },
    codeContainer: {
        padding: 30,
    },
})

export default withStyles(styles)(FileViewer)
