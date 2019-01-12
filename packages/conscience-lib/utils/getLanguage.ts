

// @@TODO: filetype standardization
export default function getLanguage(ext: string) {
    switch (ext) {
        case 'js':
        case 'json':
            return 'javascript'
        case 'ts':
            return 'typescript'
        case 'py':
            return 'python'
        case 'md':
        case 'mdown':
            return 'markdown'
        case 'tex':
            return 'latex'
        case 'proto':
            return 'protobuf'
        case 'rb':
            return 'ruby'
        case 'rs':
            return 'rust'
        default:
            return ext
    }
}
