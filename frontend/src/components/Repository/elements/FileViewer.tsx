import path from 'path'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import autobind from 'utils/autobind'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import { IRepoFile } from 'common'
import CodeViewer from './CodeViewer'
const fs = (window as any).require('fs')


@autobind
class FileViewer extends React.Component<Props, State>
{
    state = {
        fileContents: '',
        error: undefined,
    }

    render() {
        const { file, classes } = this.props
        const extension = path.extname(file.name).toLowerCase().substring(1)

        switch (extension) {
        case 'md':
            return <RenderMarkdown text={this.state.fileContents || ''} basePath={this.props.repoRoot} />
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'png':
        case 'tif':
        case 'tiff':
            return <img src={'file://' + path.join(this.props.repoRoot, file.name)} className={classes.imageEmbed} />
        case 'go':
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
        case 'py':
        case 'proto':
        case 'tex':
        case 'rb':
        case 'rs':
        case 'r':
        case 'txt':
            return <CodeViewer language={extension} contents={this.state.fileContents} showColorSelector />
        default:
            return <div>We don't have a viewer for this kind of file yet.</div>
        }
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
