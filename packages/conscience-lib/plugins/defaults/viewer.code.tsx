import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CodeViewer from 'conscience-components/CodeViewer/CodeViewer'
import { autobind, schemes } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'

@autobind
class CodeViewerPlugin extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        const language = filetypes.getLanguage(this.props.filename)
        return (
            <Card>
                <CardContent classes={{ root: classes.codeRoot }}>
                    <CodeViewer
                        language={language}
                        fileContents={this.props.fileContents}
                        codeColorScheme={this.props.codeColorScheme} />
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

type Props = OwnProps & StateProps

interface OwnProps {
    repoID: string
    directEmbedPrefix: string
    filename: string
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
    viewer: connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CodeViewerPlugin)),
}
