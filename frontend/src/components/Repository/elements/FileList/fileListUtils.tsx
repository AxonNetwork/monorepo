import path from 'path'
import { IRepoFile } from '../../../../common'

export function filterSubfolder(files: {[name: string]: IRepoFile}, selectedFolder: string) {
    const filtered = {} as {[name: string]: IRepoFile}

    for (let filepath of Object.keys(files)) {
        let file = files[filepath]

        if (file.name.indexOf(selectedFolder) === 0) {
            // const relPath = path.relative(selectedFolder, file.name)
            filtered[filepath] = file
        }
    }

    return filtered
}

export function mergeFolders(files: {[name: string]: IRepoFile}, selectedFolder: string|undefined) {
    const merged = {} as {[filepath: string]: IRepoFile}

    for (let filepath of Object.keys(files)) {
        const file = files[filepath]

        const relpath = selectedFolder === undefined
            ? file.name
            : path.relative(selectedFolder, file.name)

        const parts = relpath.split('/')

        if (parts.length === 1) {
            merged[file.name] = file
        } else {
            const folderName = parts[0]
            merged[folderName] = {
                name: selectedFolder === undefined ? folderName : path.join(selectedFolder, folderName),
                type: 'folder',
                status: '',
                size: 0,
                modified: new Date(0),
                diff: '',
                ...(merged[folderName] || {}),
            }

            if (file.status === 'M' || file.status === '?') {
                merged[folderName].status = 'M'
            }
            merged[folderName].size += file.size
            if (merged[folderName].modified < file.modified) {
                merged[folderName].modified = file.modified
            }
        }
    }
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