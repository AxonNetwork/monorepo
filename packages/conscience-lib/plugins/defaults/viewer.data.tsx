import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import DataViewer from 'conscience-components/DataViewer/DataViewer'


@autobind
class DataViewerPlugin extends React.Component<Props, State>
{
    render() {
        const extension = filetypes.ext(this.props.filename)
        return (
            <Card>
                <CardContent>
                    <DataViewer fileFormat={extension} fileContents={this.props.fileContents} />
                </CardContent>
            </Card>
        )
    }
}

interface Props {
    repoID: string
    directEmbedPrefix: string
    filename: string
    fileContents?: string
}

interface State {
    page: number
    rowsPerPage: number
}

export default {
    pluginType: 'file viewer',
    name: 'data-viewer',
    humanName: 'Default data table viewer',
    viewer: DataViewerPlugin,
}
