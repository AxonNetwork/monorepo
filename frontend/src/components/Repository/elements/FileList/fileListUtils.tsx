export function filterSubfolder(files, selectedFolder){
    files = Object.keys(files).reduce((acc, curr) => {
        const file = files[curr]
        if(file.path.indexOf(selectedFolder) > -1){
            const relPath = file.path.replace(selectedFolder + "/", "")
            acc[relPath] = file
        }
        return acc
    }, {})
    return files
}

export function mergeFolders(files){
    const merged = Object.keys(files).reduce((acc, curr)=>{
        const parts = curr.split('/')
        const file = files[curr]
        if(parts.length === 1){
            acc[curr] = file
        }else {
            const folder = parts[0]
            if(acc[folder] === undefined) {
                const folderPath = file.path.replace(curr, "") + folder
                acc[folder] = {
                    name: folder,
                    type: 'folder',
                    path: folderPath,
                    status: '',
                    size: 0,
                    modified: 0
                }
            }
            if(file.status === "*modified" || file.status === "*added"){
                acc[folder].status = "*modified"
            }
            acc[folder].size += file.size
            acc[folder].modified = Math.max(acc[folder].modified, file.modified)
        }
        return acc
    }, {})
    return merged
}