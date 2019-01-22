import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { URI } from 'conscience-lib/common'
import { IGlobalState } from '../redux'
import TextDiff from './TextDiff'
import BinaryDiff from './BinaryDiff'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import parse from 'parse-diff'


class DiffViewer extends React.Component<Props>
{
    render() {
        const { fileDiff } = this.props
        if (!fileDiff) {
            return null
        }

        const isTextFile = this.props.uri.filename ? filetypes.isTextFile(this.props.uri.filename) : false
        if (isTextFile) {
            return <TextDiff fileDiff={fileDiff} />
        } else {
            return <BinaryDiff fileDiff={fileDiff} />
        }
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    fileDiff: parse.File
}

interface StateProps {
    codeColorScheme?: string | undefined
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
