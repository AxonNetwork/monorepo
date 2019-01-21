import urljoin from 'url-join'
import React from 'react'
import { IFileViewerPluginProps } from '../index'

export default {
    pluginType: 'file viewer',
    name: 'img-viewer',
    humanName: 'Default image viewer',
    viewer: function(props: IFileViewerPluginProps) {
        const { directEmbedPrefix, blobIdentifier } = props
        const { commit, filename } = blobIdentifier
        return (
            <img src={urljoin(directEmbedPrefix, commit, filename)} style={{ maxWidth: '100%' }} />
        )
    },
}
