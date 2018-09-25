import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Chunk from './Chunk'
import BinaryDiff from './BinaryDiff'

import parse from 'parse-diff'

class DiffViewer extends Component {

    constructor(props) {
        super(props)
        this.state = {
            files: DiffViewer.parseDiff(props.diff),
        }
    }

    static parseDiff(diff) {
        if (diff.startsWith('Deleted')) {
            return diff
        }
        return parse(diff)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.diff !== this.props.diff) {
            this.setState({
                files: DiffViewer.parseDiff(this.props.diff),
            })
        }
    }

    render() {
        const classes = this.props.classes
        if (this.props.diff.startsWith('Deleted')) {
            return <Typography>{this.props.diff}</Typography>
        }
        const files = this.state.files
        const type = this.props.type || 'text'
        if (files.length < 1) {
            return <div></div>
        }
        switch (type){
            case 'image':
            case 'binary':
                return (
                    <div className={classes.root}>
                        {files.map((file, i) => (
                            <React.Fragment>
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
                        {files.map((file, i) => (
                            <React.Fragment key={i}>
                                {file.chunks.map(chunk => (
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

DiffViewer.propTypes = {
    classes: PropTypes.object.isRequired,
    diff: PropTypes.string.isRequired,
    type: PropTypes.string,
}

const styles = theme => ({
    root: {
        margin: '16px 0 1px 0',
    },
})

export default withStyles(styles)(DiffViewer)
