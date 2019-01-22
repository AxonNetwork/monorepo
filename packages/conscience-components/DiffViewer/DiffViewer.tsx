import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { URI } from 'conscience-lib/common'
import { IGlobalState } from '../redux'
import TextDiff from './TextDiff'
import BinaryDiff from './BinaryDiff'
import * as filetypes from 'conscience-lib/utils/fileTypes'

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

        const isTextFile = this.props.uri.filename ? filetypes.isTextFile(this.props.uri.filename) : false
        if (isTextFile) {
            return (
                <React.Fragment>
                    {files.map(file => (
                        <TextDiff
                            key={file.to}
                            filename={file.to || ''}
                            chunks={file.chunks}
                        />
                    ))}
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    {files.map(file => (
                        <BinaryDiff key={file.name} file={file} />
                    ))}
                </React.Fragment>
            )
        }
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    diff: string
}

interface StateProps {
    codeColorScheme?: string | undefined
}

interface State {
    files: parse.File[] | undefined
}


const styles = createStyles({
    root: {},
})

const mapStateToProps = (state: IGlobalState) => {
    const { codeColorScheme } = state.user.userSettings
    return {
        codeColorScheme,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(DiffViewer))
