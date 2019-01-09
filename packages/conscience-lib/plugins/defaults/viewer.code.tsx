import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CodeViewer from 'conscience-components/CodeViewer/CodeViewer'

class CodeViewerWrapper extends React.Component<Props>
{
    render() {
        const extension = path.extname(this.props.filename).toLowerCase().substring(1)
        return (
            <Card>
                {/*<CardContent classes={{ root: classes.codeRoot }}>*/}
                <CardContent>
                    <CodeViewer
                        language={extension}
                        contents={this.props.fileContents}
                        codeColorScheme={this.props.codeColorScheme}
                    />
                </CardContent>
            </Card>
        )
    }
}

type Props = OwnProps & StateProps

interface OwnProps {
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
    viewer: connect(mapStateToProps, mapDispatchToProps)(CodeViewerWrapper),
}
