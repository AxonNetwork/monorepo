import React from 'react'
import CodeIcon from '@material-ui/icons/Code'
import AssessmentIcon from '@material-ui/icons/Assessment'
import SubjectIcon from '@material-ui/icons/Subject'
import ImageIcon from '@material-ui/icons/Image'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import ViewWeekIcon from '@material-ui/icons/ViewWeek'

function AssessmentIconColored() {
    return <AssessmentIcon style={{ fill: '#61a961' }} />
}

function ImageIconColored() {
    return <ImageIcon style={{ fill: '#a771d8' }} />
}

function InsertDriveFileIconColored() {
    return <InsertDriveFileIcon style={{ fill: '#358fff' }} />
}

function CodeIconColored() {
    return <CodeIcon style={{ fill: '#f93d3d' }} />
}

function ViewWeekIconColored() {
    return <div style={{ backgroundColor: '#358fff', borderRadius: 5, height: 24, paddingLeft: 1 }}><ViewWeekIcon style={{ fill: 'white' }} /></div>
}

export default {
    pluginType: 'file type',
    fileTypes: [
        { extensions: ['csv'],         type: 'data', humanReadableType: 'Data (CSV)', iconComponent: AssessmentIconColored, isTextFile: true, viewers: ['spreadsheet-viewer', 'data-viewer', 'code-viewer'], editors: ['spreadsheet-editor','text-editor'] },
        { extensions: ['xls', 'xlsx'], type: 'data', humanReadableType: 'Data (Excel)', iconComponent: AssessmentIconColored, isTextFile: true, viewers: ['spreadsheet-viewer'], editors: [] },

        { extensions: ['go'],                type: 'code', humanReadableType: 'Code (Go)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'go' },
        { extensions: ['js', 'jsx', 'json'], type: 'code', humanReadableType: 'Code (Javascript)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'javascript' },
        { extensions: ['ts', 'tsx'],         type: 'code', humanReadableType: 'Code (Typescript)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'typescript' },
        { extensions: ['py', 'py2', 'py3'],  type: 'code', humanReadableType: 'Code (Python)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'python' },
        { extensions: ['sh'],                type: 'code', humanReadableType: 'Code (Shell script)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'bash' },
        { extensions: ['proto'],             type: 'code', humanReadableType: 'Code (Protobuf)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'protobuf' },
        { extensions: ['latex', 'tex'],      type: 'code', humanReadableType: 'Code (Latex)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'latex' },
        { extensions: ['rb'],                type: 'code', humanReadableType: 'Code (Ruby)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'ruby' },
        { extensions: ['rs'],                type: 'code', humanReadableType: 'Code (Rust)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'rust' },
        { extensions: ['r'],                 type: 'code', humanReadableType: 'Code (R)', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor'], language: 'r' },

        { extensions: ['doc', 'docx'],             type: 'text', humanReadableType: 'MS Word document', iconComponent: SubjectIcon, isTextFile: true, viewers: [], editors: [] },
        { extensions: ['txt'],                     type: 'text', humanReadableType: 'Text file', iconComponent: SubjectIcon, isTextFile: true, viewers: ['code-viewer'], editors: ['text-editor', 'markdown-editor'] },
        { extensions: ['md', 'mdown', 'markdown'], type: 'text', humanReadableType: 'Markdown document', iconComponent: SubjectIcon, isTextFile: true, viewers: ['markdown-viewer', 'code-viewer'], editors: ['markdown-editor', 'text-editor'] },

        { extensions: ['png'],                type: 'image', humanReadableType: 'PNG image', iconComponent: ImageIconColored, isTextFile: false, viewers: ['img-viewer'], editors: [] },
        { extensions: ['jpg', 'jpeg', 'jpe'], type: 'image', humanReadableType: 'JPEG image', iconComponent: ImageIconColored, isTextFile: false, viewers: ['img-viewer'], editors: [] },
        { extensions: ['gif'],                type: 'image', humanReadableType: 'GIF image', iconComponent: ImageIconColored, isTextFile: false, viewers: ['img-viewer'], editors: [] },
        { extensions: ['tif', 'tiff'],        type: 'image', humanReadableType: 'TIF image', iconComponent: ImageIconColored, isTextFile: false, viewers: ['img-viewer'], editors: [] },

        { extensions: ['pdf'], type: 'pdf', humanReadableType: 'PDF document', iconComponent: InsertDriveFileIconColored, isTextFile: false, viewers: ['pdf-viewer'], editors: [] },

        { extensions: ['kanban'], type: 'kanban', humanReadableType: 'Kanban board', iconComponent: ViewWeekIconColored, isTextFile: true, viewers: [], editors: ['kanban-editor', 'text-editor'] },
    ]
}
