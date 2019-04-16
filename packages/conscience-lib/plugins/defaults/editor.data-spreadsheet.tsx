import isEqual from 'lodash/isEqual'
import React from 'react'
import XLSX from 'xlsx'
import Spreadsheet from 'x-data-spreadsheet'
import { autobind } from 'conscience-lib/utils'
import { URI, FileMode } from 'conscience-lib/common'
import { getFileContents, saveFileContents } from 'conscience-components/env-specific'
import { selectFile } from 'conscience-components/navigation'


@autobind
class SpreadsheetEditorPlugin extends React.Component<Props, State>
{
    state = {
        data: null,
        error: undefined,
    }

    _container: HTMLDivElement | null = null

    render() {
        // const { data } = this.state
        // if (data === null) {
        //     return <LargeProgressSpinner />
        // }

        return (
            <div>
                <div ref={x => this._container = x} style={{ height: 'calc(100vh - 230px)' }}></div>
            </div>
        )
    }

    componentDidMount() {
        if (!this.props.isNewFile) {
            this.updateFileContents()
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri) && !this.props.isNewFile) {
            this.updateFileContents()
        }
    }

    serialize = (data: any) => {
        const sheet = {} as XLSX.Sheet
        let maxRow = 0
        let maxCol = 0
        for (let r of Object.keys(data.rows)) {
            const row = parseInt(r, 10)
            maxRow = row > maxRow ? row : maxRow

            for (let c of Object.keys(data.rows[r].cells)) {
                const col = parseInt(c, 10)
                maxCol = col > maxCol ? col : maxCol

                const cellName = XLSX.utils.encode_cell({c: col, r: row})
                sheet[cellName] = {
                    v: data.rows[r].cells[c].text,
                    t: 's',
                }
            }
        }

        // Set the range that fully encloses the sheet
        sheet['!ref'] = 'A1:' + XLSX.utils.encode_cell({c: maxCol, r: maxRow})

        return XLSX.utils.sheet_to_csv(sheet)
    }

    deserialize = (fileContents: Buffer) => {
        const workbook = XLSX.read(fileContents, { type: 'buffer' })
        const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]]

        const rows = {} as any
        const cellKeys = Object.keys(sheet).filter(x => x[0] !== '!')
        for (let cellKey of cellKeys) {
            const { c, r } = XLSX.utils.decode_cell(cellKey)
            rows[r] = rows[r] || {}
            rows[r].cells = rows[r].cells || {}

            if (sheet[cellKey].f) {
                rows[r].cells[c] = { text: '=' + sheet[cellKey].f }
            } else {
                rows[r].cells[c] = { text: sheet[cellKey].v }
            }
        }

        return rows
    }

    async updateFileContents() {
        try {
            const fileContents = (await getFileContents(this.props.uri, { as: 'buffer' }) as Buffer)
            const rows = this.deserialize(fileContents)
            const initialData = {
                borders: [ ['thin', '#0366d6'], ],
                styles: [ { bgcolor: '#f4f5f8', wrapText: true, color: '#900b09', bbi: 0, bti: 0, bri: 0, bli: 0 }, ],
                rows,
            }

            new Spreadsheet(this._container, {
                showToolbar: false,
                showGrid: true,
                row: { len: Object.keys(rows).length + 100 }, // max rows
                view: {
                    height: () => this._container!.clientHeight,
                    width: () => this._container!.clientWidth,
                },
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

            }).loadData(initialData).change((data: any) => {
                this.setState({ data })
                this.props.setFileModified(true)
            })

            this.setState({ data: initialData })

        } catch (error) {
            console.error(error)
            this.setState({ error })
        }
    }

    async saveFileContents(fileContents: string) {
        await saveFileContents(this.props.uri, fileContents)
        if (this.props.isNewFile) {
            selectFile(this.props.uri, FileMode.Edit)
        }
        this.props.setFileModified(false)
    }

    onClickSave = () => {
        const rawData = this.serialize(this.state.data)
        this.saveFileContents(rawData)
    }
}

interface Props {
    uri: URI
    isNewFile: boolean
    setFileModified: (fileModified: boolean) => void
}

interface State {
    data: any
    error: Error|undefined
}

export default {
    pluginType: 'file editor',
    name: 'spreadsheet-editor',
    humanName: 'Spreadsheet editor',
    editor: SpreadsheetEditorPlugin,
    showSaveButton: true,
}
