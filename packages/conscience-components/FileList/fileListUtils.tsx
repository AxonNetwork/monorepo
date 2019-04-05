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
export function makeTree(allFiles: { [name: string]: IRepoFile }) {
    const tree = {
        files: {}
    }
    for (let key of Object.keys(allFiles)) {
        setPath(allFiles, tree, key)
    }
    return tree
}

function setPath(allFiles: { [name: string]: IRepoFile }, tree: any, keypath: string) {
    const file = allFiles[keypath]

    tree.files = tree.files || {}
    const parts = keypath.split('/')
    let basepath = ''
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]

        if (i < parts.length - 1) {
            if (tree.files[part] === undefined) {
                tree.files[part] = { ...allFiles[path.join(basepath, part)], files: {} }
            }
        } else if (i === parts.length - 1) {
            tree.files[part] = tree.files[part] || { ...file, files: {} }
            return
        }
        tree = tree.files[part]
        basepath = basepath
            ? basepath + '/' + part
            : part
    }
}

// Sort folders above files.  Anything of the same type is sorted alphabetically.
export function sortFiles(files: IRepoFile[]) {
    return files.sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') { return -1 }
        if (a.type !== 'folder' && b.type === 'folder') { return 1 }
        return (a.name < b.name ? -1 : 1)
    })
}



