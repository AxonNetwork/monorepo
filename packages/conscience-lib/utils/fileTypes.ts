import path from 'path'

export function isTextFile(filename: string) {
    if (!filename) {
        return false
    }

    const extension = path.extname(filename).toLowerCase().substring(1)
    return [
        'md',
        'go',
        'js',
        'jsx',
        'json',
        'ts',
        'tsx',
        'py',
        'proto',
        'tex',
        'rb',
        'rs',
        'r',
        'txt',
        'csv',
    ].includes(extension)
}
