
export default {
    pluginType: 'file type',
    fileTypes: [
        { extensions: ['csv'],         type: 'data', isTextFile: true, viewers: ['table'], editors: [] },
        { extensions: ['xls', 'xlsx'], type: 'data', isTextFile: true, viewers: [], editors: [] },

        { extensions: ['go'],                type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'go' },
        { extensions: ['js', 'jsx', 'json'], type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'javascript' },
        { extensions: ['ts', 'tsx'],         type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'typescript' },
        { extensions: ['py', 'py2', 'py3'],  type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'python' },
        { extensions: ['proto'],             type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'protobuf' },
        { extensions: ['latex', 'tex'],      type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'latex' },
        { extensions: ['rb'],                type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'ruby' },
        { extensions: ['rs'],                type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'rust' },
        { extensions: ['r'],                 type: 'code', isTextFile: true, viewers: ['code-viewer'], editors: [], language: 'r' },

        { extensions: ['doc', 'docx'],             type: 'text', isTextFile: true, viewers: [], editors: [] },
        { extensions: ['txt'],                     type: 'text', isTextFile: true, viewers: ['code-viewer'], editors: ['text'] },
        { extensions: ['md', 'mdown', 'markdown'], type: 'text', isTextFile: true, viewers: ['markdown-viewer'], editors: ['markdown'] },

        { extensions: ['png'],                type: 'image', isTextFile: false, viewers: ['img'], editors: [] },
        { extensions: ['jpg', 'jpeg', 'jpe'], type: 'image', isTextFile: false, viewers: ['img'], editors: [] },
        { extensions: ['gif'],                type: 'image', isTextFile: false, viewers: ['img'], editors: [] },
        { extensions: ['tif', 'tiff'],        type: 'image', isTextFile: false, viewers: ['img'], editors: [] },

        { extensions: ['pdf'], type: 'pdf', isTextFile: false, viewers: ['embed'], editors: [] },
    ]
}
