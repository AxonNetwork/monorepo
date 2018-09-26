import { IRepoFile } from '../../../../common'

export function filterSubfolder(files: {[name: string]: IRepoFile}, selectedFolder: string) {
    files = Object.keys(files).reduce((acc: {[name: string]: IRepoFile}, curr: string) => {
        const file = files[curr]
        if (file.path.indexOf(selectedFolder) > -1) {
            const relPath = file.path.replace(selectedFolder + '/', '')
            acc[relPath] = file
        }
        return acc
    }, {})
    return files
}

export function mergeFolders(files: {[name: string]: IRepoFile}) {
    const merged = Object.keys(files).reduce((acc: {[name: string]: IRepoFile}, curr: string) => {
        const parts = curr.split('/')
        const file = files[curr]
        if (parts.length === 1) {
            acc[curr] = file
        }else {
            const folder = parts[0]
            if (acc[folder] === undefined) {
                const folderPath = file.path.replace(curr, '') + folder
                acc[folder] = {
                    name: folder,
                    type: 'folder',
                    path: folderPath,
                    status: '',
                    size: 0,
                    modified: new Date(0),
                    diff: "",
                }
            }
            if (file.status === '*modified' || file.status === '*added') {
                acc[folder].status = '*modified'
            }
            acc[folder].size += file.size
            if(acc[folder].modified > file.modified){
                acc[folder].modified = file.modified
            }
        }
        return acc
    }, {})
    return merged
}

export function sortFolders(files: {[name: string]: IRepoFile}) {
    const names = Object.keys(files).sort((a, b) => {
        if (files[a].type === 'folder' && files[b].type !== 'folder') { return -1 }
        if (files[a].type !== 'folder' && files[b].type === 'folder') { return 1 }
        return (a < b ? -1 : 1)
    })
    return names
}