import isEqual from 'lodash/isEqual'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CodeViewer from 'conscience-components/CodeViewer/CodeViewer'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { URI } from 'conscience-lib/common'
import { getFileContents } from 'conscience-components/env-specific'

@autobind
class CodeViewerPlugin extends React.Component<Props, State>
{
    state = {
        fileContents: '',
    }

    render() {
        const { classes } = this.props
        const language = this.props.uri.filename ? filetypes.getLanguage(this.props.uri.filename) : ''
        return (
            <Card>
                <CardContent classes={{ root: classes.codeRoot }}>
                    <CodeViewer
                        language={language}
                        fileContents={this.state.fileContents || ''}
                        classes={classes}
                    />
                </CardContent>
            </Card>
        )
    }

    componentDidMount() {
        this.updateFileContents()
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri)) {
            this.updateFileContents()
        }
    }

    async updateFileContents() {
        if (!this.props.uri.filename) {
            this.setState({ fileContents: null })
            return
        }

        try {
            const fileContents = (await getFileContents(this.props.uri)) as string
            this.setState({ fileContents })
        } catch (error) {
            this.setState({ fileContents: null })
        }
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
}

interface StateProps {
    codeColorScheme: string
}

interface State {
    fileContents: string|null
}

// @@TODO: change `state` back to type `IGlobalState`?  how to handle desktop vs. web?
const mapStateToProps = (state: any, ownProps: OwnProps) => {
    return {
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

const mapDispatchToProps = {}

export default {
    pluginType: 'file editor',
    name: 'code-viewer',
    humanName: 'Default code viewer',
    editor: connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CodeViewerPlugin)),
    widthMode: 'full',
}
