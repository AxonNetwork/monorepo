import path from 'path'
import { IRepoFile } from 'conscience-lib/common'

// Tree format:
// {
//     files: {
//         file1.go: IRepoFile
//         file2.js: IRepoFile
//         folder-a: {
//             ...IRepoFile
//             files: {
//                 file3.png: IRepoFile
//                 file4.gif: IRepoFile
//             }
//         }
//     }
// }
export function makeTree(files: { [name: string]: IRepoFile }) {
    const tree = {}
    for (let key of Object.keys(files)) {
        setPath(tree, key, files[key])
    }
    return tree
}

function setPath(obj: any, keypath: string, value: any) {
    obj.files = obj.files || {}
    const parts = keypath.split('/')
    let basepath = null
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (obj.files[part] === undefined && i < parts.length - 1) {
            obj.files[part] = {
                name: path.join(basepath || '', part),
                type: 'folder',
                status: '',
                size: 0,
                modified: new Date(0),
                diff: '',
                mergeConflict: false,
                mergeUnresolved: false,
                files: {},
            }
        } else if (i === parts.length - 1) {
            obj.files[part] = value
            return
        }
        obj = obj.files[part]
        basepath = basepath
            ? basepath + '/' + part
            : part
    }
}

// Sort folders above files.  Anything of the same type is sorted alphabetically.
export function sortFiles(files: { [name: string]: IRepoFile }) {
    const names = Object.keys(files).sort((a, b) => {
        if (files[a].type === 'folder' && files[b].type !== 'folder') { return -1 }
        if (files[a].type !== 'folder' && files[b].type === 'folder') { return 1 }
        return (a < b ? -1 : 1)
    })
    return names
}