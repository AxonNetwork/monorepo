import path from 'path'

// @@TODO: filetype standardization
export function fileType(filename: string) {
    const extension = path.extname(filename).substr(1)
    switch (extension) {
        case 'csv':
        case 'xls':
            return 'data'
        case 'go':
        case 'js':
        case 'jsx':
        case 'json':
        case 'ts':
        case 'tsx':
        case 'py':
        case 'proto':
        case 'tex':
        case 'rb':
        case 'rs':
        case 'r':
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

export function isTextFile(filename: string) {
    if (!filename) {
        return false
    }
    const type = fileType(filename)
    return type === 'code' || type === 'text'
}
