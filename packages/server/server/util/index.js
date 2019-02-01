import path from 'path'

export function filemodeIsDir(filemode) {
    return filemode === 0o040000
}

// @@TODO: filetype standardization
export function fileType(filename) {
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
