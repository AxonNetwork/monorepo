import path from 'path'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import autobind from 'utils/autobind'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
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
        const { filename, classes } = this.props
        if (!filename) {
            return null
        }

        const extension = path.extname(filename).toLowerCase().substring(1)

        // @@TODO: filetype standardization
        switch (extension) {
        case 'md':
        case 'mdown':
        case 'markdown':
            return (
                <Card>
                    <CardContent classes={{ root: classes.mdRoot }}>
                        <RenderMarkdown text={this.state.fileContents || ''} basePath={this.props.repoRoot} />
                    </CardContent>
                </Card>
            )
        case 'jpg':
        case 'jpeg':
        case 'gif':
        case 'png':
        case 'tif':
        case 'tiff':
            return <img src={'file://' + path.join(this.props.repoRoot, filename)} className={classes.imageEmbed} />
        case 'go':
        case 'js':
        case 'jsx':
        case 'json':
        case 'ts':
        case 'tsx':
        case 'py':
        case 'proto':
        case 'tex':
        case 'rb':
        case 'rs':
        case 'r':
        case 'txt':
            return (
                <Card>
                    <CardContent classes={{ root: classes.codeRoot }}>
                        <CodeViewer language={extension} contents={this.state.fileContents} />
                    </CardContent>
                </Card>
            )
        default:
            return <div>We don't have a viewer for this kind of file yet.</div>
        }
    }

    componentDidMount() {
        if (this.isTextFile(this.props.filename)) {
            this.readFile()
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.isTextFile(this.props.filename) &&
            (prevProps.filename !== this.props.filename || prevProps.repoRoot !== this.props.repoRoot)
        ) {
            this.readFile()
        }
    }

    readFile() {
        if (!this.props.filename) {
            return
        }

        fs.readFile(path.join(this.props.repoRoot, this.props.filename), 'utf8', (err: Error, contents: string) => {
            if (err) {
                // @@TODO: display error in UI
                console.error(err)
                this.setState({ fileContents: '', error: err })
                return
            }
            this.setState({ fileContents: contents })
        })
    }

    isTextFile(filename: string) {
        if (!filename) {
            return false
        }

        const extension = path.extname(filename).toLowerCase().substring(1)
        return [
            'md',
            'go',
            'js',
            'jsx',
            'json',
            'ts',
            'tsx',
            'py',
            'proto',
            'tex',
            'rb',
            'rs',
            'r',
            'txt',
        ].includes(extension)
    }
}

interface Props {
    filename: string
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
    mdRoot: {
        padding: 48,
        minWidth: 680,
    },
    codeRoot: {
        padding: 0,
        paddingBottom: '0 !important',
        minWidth: 680,
    },
})

export default withStyles(styles)(FileViewer)
