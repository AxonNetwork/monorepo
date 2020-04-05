import isEqual from 'lodash/isEqual'
import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import DataViewer from 'conscience-components/DataViewer/DataViewer'
import { URI } from 'conscience-lib/common'
import { getFileContents } from 'conscience-components/env-specific'


@autobind
class DataViewerPlugin extends React.Component<Props, State>
{
    state = {
        fileContents: '',
    }

    render() {
        const extension = this.props.uri.filename ? filetypes.ext(this.props.uri.filename) : 'csv'
        return (
            <Card>
                <CardContent>
                    <DataViewer fileFormat={extension} fileContents={this.state.fileContents || ''} />
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
        console.log('updateFileContents')
        if (!this.props.uri.filename) {
            this.setState({ fileContents: null })
        console.log('updateFileContents null 1')
            return
        }

        try {
            const fileContents = (await getFileContents(this.props.uri)) as string
            this.setState({ fileContents })
        console.log('updateFileContents YES', fileContents)
        } catch (error) {
        console.log('updateFileContents null 2')
            this.setState({ fileContents: null })
        }
    }
}

interface Props {
    uri: URI
}

interface State {
    fileContents: string|null
}

export default {
    pluginType: 'file editor',
    name: 'data-viewer',
    humanName: 'Default data table viewer',
    editor: DataViewerPlugin,
    widthMode: 'breakpoints',
}
