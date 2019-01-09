import path from 'path'
import { flatMap } from 'lodash'
import { getPlugins, IFileType, IViewerComponent, IFileViewerPlugin } from '../plugins'

export const filetypes = function() {
    const filetypes = flatMap( getPlugins('file type').map(plugin => plugin.fileTypes) )

    const types = {} as {[extension: string]: IFileType}
    for (let filetype of filetypes) {
        for (let ext of filetype.extensions) {
            types[ext] = filetype
        }
    }
    return types
}()

export const fileViewers = function() {
    const plugins = getPlugins('file viewer') as IFileViewerPlugin[]

    const viewers: {[name: string]: IViewerComponent} = {}
    for (let plugin of plugins) {
        viewers[plugin.name] = plugin.viewer
    }
    return viewers
}()

// @@TODO: filetype standardization
export function fileType(filename: string) {
    const extension = path.extname(filename).substr(1)
    if (filetypes[extension] !== undefined) {
        return filetypes[extension].type
    } else {
        return 'unknown'
    }
}

export function isTextFile(filename: string) {
    const extension = path.extname(filename).substr(1)
    return (filetypes[extension] || {}).isTextFile || false
}

export function getLanguage(filename: string) {
    const extension = path.extname(filename).substr(1)
    const filetype = filetypes[extension] || {}
    if (filetype.type === 'code') {
        return filetype.language || extension
    }
    return extension
}


