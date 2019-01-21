import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CodeViewer from 'conscience-components/CodeViewer/CodeViewer'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { URI } from 'conscience-lib/common'

@autobind
class CodeViewerPlugin extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        const language = this.props.uri.filename ? filetypes.getLanguage(this.props.uri.filename) : ''
        return (
            <Card>
                <CardContent classes={{ root: classes.codeRoot }}>
                    <CodeViewer
                        language={language}
                        fileContents={this.props.fileContents || ''}
                        classes={classes}
                    />
                </CardContent>
            </Card>
        )
    }
}

const styles = () => createStyles({
    codeRoot: {
        padding: 0,
        paddingBottom: '0 !important',
        minWidth: 680,
    },
})

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    fileContents?: string
}

interface StateProps {
    codeColorScheme: string
}

// @@TODO: change `state` back to type `IGlobalState`?  how to handle desktop vs. web?
const mapStateToProps = (state: any, ownProps: OwnProps) => {
    return {
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

const mapDispatchToProps = {}

export default {
    pluginType: 'file viewer',
    name: 'code-viewer',
    humanName: 'Default code viewer',
    viewer: connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CodeViewerPlugin)),
}
