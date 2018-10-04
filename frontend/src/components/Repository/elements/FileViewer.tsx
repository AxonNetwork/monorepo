import path from 'path'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import autobind from 'utils/autobind'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import { IRepoFile } from 'common'
const fs = (window as any).require('fs')


@autobind
class FileViewer extends React.Component<Props, State>
{
    state = { fileContents: '', error: undefined }

    render() {
        const { file } = this.props
        const extension = path.extname(file.name).toLowerCase()

        switch (extension) {
        case '.md':
            return <RenderMarkdown text={this.state.fileContents || ''} basePath={this.props.repoRoot} />
        case '.jpg':
            return <img src={'file://' + path.join(this.props.repoRoot, file.name)} />
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
})

export default withStyles(styles)(FileViewer)
