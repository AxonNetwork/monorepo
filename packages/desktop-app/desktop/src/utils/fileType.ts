import path from 'path'

// @@TODO: filetype standardization
function fileType(filename: string) {
    const extension = path.extname(filename).substr(1)
    switch (extension) {
        case 'csv':
        case 'xls':
            return 'data'
        case 'py':
        case 'js':
        case 'go':
            return 'code'
        case 'txt':
        case 'doc':
        case 'md':
            return 'text'
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return 'image'
        default:
            return 'unknown'
    }
}

export default fileType