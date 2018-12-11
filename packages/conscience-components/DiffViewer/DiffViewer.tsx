import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextDiff from './TextDiff'
import BinaryDiff from './BinaryDiff'

import parse from 'parse-diff'

class DiffViewer extends React.Component<Props, State>
{
    constructor(props: Props) {
        super(props)
        this.state = {
            files: DiffViewer.parseDiff(props.diff),
        }
    }

    static parseDiff(diff: string) {
        if (diff.startsWith('Deleted')) {
            return
        }
        return parse(diff)
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.diff !== this.props.diff) {
            this.setState({
                files: DiffViewer.parseDiff(this.props.diff),
            })
        }
    }

    render() {
        const { diff } = this.props
        if (diff.startsWith('Deleted')) {
            return <Typography>{diff}</Typography>
        }
        const files = this.state.files || []
        if (files.length < 1) {
            return null
        }

        const type = this.props.type || 'text'
        switch (type) {
            case 'image':
            case 'binary':
                return (
                    <React.Fragment>
                        {files.map((file: any) => (
                            <BinaryDiff key={file.name} file={file} />
                        ))}
                    </React.Fragment>
                )

            case 'data':
            case 'text':
            default:
                return (
                    <React.Fragment>
                        {files.map((file: any) => (
                            <TextDiff
                                key={file.to}
                                filename={file.to}
                                type={type}
                                chunks={file.chunks}
                                codeColorScheme={this.props.codeColorScheme}
                            />
                        ))}
                    </React.Fragment>
                )
        }
    }
}

interface Props {
    diff: string
    type: string
    codeColorScheme?: string | undefined
    classes: any
}

interface State {
    files: parse.File[] | undefined
}


const styles = createStyles({
    root: {},
})

export default withStyles(styles)(DiffViewer)
