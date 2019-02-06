import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import DataViewer from 'conscience-components/DataViewer/DataViewer'
import { URI } from 'conscience-lib/common'


@autobind
class DataViewerPlugin extends React.Component<Props, State>
{
    render() {
        const extension = this.props.uri.filename ? filetypes.ext(this.props.uri.filename) : 'csv'
        return (
            <Card>
                <CardContent>
                    <DataViewer fileFormat={extension} fileContents={this.props.fileContents || ''} />
                </CardContent>
            </Card>
        )
    }
}

interface Props {
    uri: URI
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
    widthMode: 'breakpoints',
}
