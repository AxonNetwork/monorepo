import React from 'react'
import XLSX from 'xlsx'
import Spreadsheet from 'x-data-spreadsheet'
import { autobind } from 'conscience-lib/utils'
import { URI } from 'conscience-lib/common'
import { getFileContents } from 'conscience-components/env-specific'


@autobind
class SpreadsheetViewerPlugin extends React.Component<Props, State>
{
    _container: HTMLDivElement | null = null

    async componentDidMount() {
        const { uri } = this.props

        const data = await getFileContents(uri, { as: 'buffer' })
        const workbook = XLSX.read(data, { type: 'buffer' })
        const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]
        let j = XLSX.utils.sheet_to_json(sheet, { header: 1 })
        j = j.map((row: any) => {
            return row.map((cell: string) => {
                return { text: cell }
            })
        })
        console.log('json sheet', j)


        new Spreadsheet(this._container).loadData({
            // freeze: [2, 2],
            borders: [
                ['thin', '#0366d6'],
            ],
            styles: [
                { bgcolor: '#f4f5f8', wrapText: true, color: '#900b09', bbi: 0, bti: 0, bri: 0, bli: 0 },
            ],
            // merges: [
            //     [[2, 2], [3, 3]],
            // ],
            cellmm: j,
            // {
            //     1: {
            //         0: { text: 'testingtesttestetst' },
            //         2: { text: 'testing' },
            //     },
            //     2: {
            //         0: { text: 'render', si: 0 },
            //         1: { text: 'Hello' },
            //         2: { text: 'haha', merge: [1, 1] },
            //         3: { text: 'overlayerll' },
            //     },
            //     8: {
            //         8: { text: 'border test', si: 0 },
            //     },
            // },
        })
    }

    render() {
        // const extension = this.props.uri.filename ? filetypes.ext(this.props.uri.filename) : 'csv'
        return (
            <div ref={x => this._container = x}></div>
        )
    }
}

interface Props {
    uri: URI
    fileContents?: string
}

interface State {
}

export default {
    pluginType: 'file viewer',
    name: 'spreadsheet-viewer',
    humanName: 'Spreadsheet viewer',
    viewer: SpreadsheetViewerPlugin,
    widthMode: 'full',
}
