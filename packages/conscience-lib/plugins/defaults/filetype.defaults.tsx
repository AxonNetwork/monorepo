import React from 'react'
import CodeIcon from '@material-ui/icons/Code'
import AssessmentIcon from '@material-ui/icons/Assessment'
import SubjectIcon from '@material-ui/icons/Subject'
import ImageIcon from '@material-ui/icons/Image'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'

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

export default {
    pluginType: 'file type',
    fileTypes: [
        { extensions: ['csv'],         type: 'data', iconComponent: AssessmentIconColored, isTextFile: true, viewers: ['data-viewer', 'code-viewer'], editors: [] },
        { extensions: ['xls', 'xlsx'], type: 'data', iconComponent: AssessmentIconColored, isTextFile: true, viewers: [], editors: [] },

        { extensions: ['go'],                type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'go' },
        { extensions: ['js', 'jsx', 'json'], type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'javascript' },
        { extensions: ['ts', 'tsx'],         type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'typescript' },
        { extensions: ['py', 'py2', 'py3'],  type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'python' },
        { extensions: ['sh'],                type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'bash' },
        { extensions: ['proto'],             type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'protobuf' },
        { extensions: ['latex', 'tex'],      type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'latex' },
        { extensions: ['rb'],                type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'ruby' },
        { extensions: ['rs'],                type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'rust' },
        { extensions: ['r'],                 type: 'code', iconComponent: CodeIconColored, isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'r' },

        { extensions: ['doc', 'docx'],             type: 'text', iconComponent: SubjectIcon, isTextFile: true, viewers: [], editors: [] },
        { extensions: ['txt'],                     type: 'text', iconComponent: SubjectIcon, isTextFile: true, viewers: ['code-viewer'], editors: ['text'] },
        { extensions: ['md', 'mdown', 'markdown'], type: 'text', iconComponent: SubjectIcon, isTextFile: true, viewers: ['markdown-viewer', 'code-viewer'], editors: ['markdown-editor'] },

        { extensions: ['png'],                type: 'image', iconComponent: ImageIconColored, isTextFile: false, viewers: ['img-viewer'], editors: [] },
        { extensions: ['jpg', 'jpeg', 'jpe'], type: 'image', iconComponent: ImageIconColored, isTextFile: false, viewers: ['img-viewer'], editors: [] },
        { extensions: ['gif'],                type: 'image', iconComponent: ImageIconColored, isTextFile: false, viewers: ['img-viewer'], editors: [] },
        { extensions: ['tif', 'tiff'],        type: 'image', iconComponent: ImageIconColored, isTextFile: false, viewers: ['img-viewer'], editors: [] },

        { extensions: ['pdf'], type: 'pdf', iconComponent: InsertDriveFileIconColored, isTextFile: false, viewers: ['embed-viewer'], editors: [] },
    ]
}
