import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Chunk from './Chunk'
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
        const { diff, classes } = this.props
        if (diff.startsWith('Deleted')) {
            return <Typography>{diff}</Typography>
        }
        const files = this.state.files || []
        const type = this.props.type || 'text'
        if (files.length < 1) {
            return <div></div>
        }
        switch (type){
            case 'image':
            case 'binary':
                return (
                    <div className={classes.root}>
                        {files.map((file:any, i:number) => (
                            <React.Fragment key={i}>
                                <BinaryDiff file={file} />
                            </React.Fragment>
                        ))}
                    </div>
                )
            case 'data':
            case 'text':
            default:
                return (
                    <div className={classes.root}>
                        {files.map((file:any, i:number) => (
                            <React.Fragment key={i}>
                                {file.chunks.map((chunk:any) => (
                                    <Chunk
                                        key={chunk.newStart}
                                        chunk={chunk}
                                        filename={file.to}
                                        type={type}
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                )
        }
    }
}

interface Props {
    diff: string
    type: string
    classes: any
}

interface State {
    files: parse.File[]|undefined
}


const styles = createStyles({
    root: {
        margin: '16px 0 1px 0',
    },
})

export default withStyles(styles)(DiffViewer)
