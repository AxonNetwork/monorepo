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

        const dataAsArray = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any

        const rows = {} as any
        for (let i = 0; i < dataAsArray.length; i++) {
            const cells = {} as any
            for (let j = 0; j < dataAsArray[i].length; j++) {
                cells[j] = { text: dataAsArray[i][j] }
            }

            rows[i] = { cells }
        }

        new Spreadsheet(this._container, {
            showToolbar: false,
            showGrid: true,
            view: {
                height: () => (this._container || {} as any).clientHeight || 300,
                width: () => (this._container || {} as any).clientWidth || 300,
            },
            // row: {
            //     len: 100,
            //     height: 25,
            // },
            // col: {
            //     len: 26,
            //     width: 100,
            //     indexWidth: 60,
            //     minWidth: 60,
            // },
            style: {
                bgcolor: '#ffffff',
                align: 'left',
                valign: 'middle',
                textwrap: false,
                strike: false,
                underline: false,
                color: '#0a0a0a',
                font: {
                    name: 'Helvetica',
                    size: 10,
                    bold: false,
                    italic: false,
                },
            },
        }).loadData({
            borders: [
                ['thin', '#0366d6'],
            ],
            styles: [
                { bgcolor: '#f4f5f8', wrapText: true, color: '#900b09', bbi: 0, bti: 0, bri: 0, bli: 0 },
            ],
            rows,
        })
    }

    render() {
        return (
            <div ref={x => this._container = x} style={{ height: 'calc(100vh - 230px)' }}></div>
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
