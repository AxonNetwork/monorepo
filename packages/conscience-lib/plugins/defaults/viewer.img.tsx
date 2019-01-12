import urljoin from 'url-join'
import React from 'react'

export default {
    pluginType: 'file viewer',
    name: 'img-viewer',
    humanName: 'Default image viewer',
    viewer: function(props: { repoID: string, directEmbedPrefix: string, filename: string, fileContents?: string }) {
        const { directEmbedPrefix, filename } = props
        return (
            <img src={urljoin(directEmbedPrefix, filename)} style={{ maxWidth: '100%' }} />
        )
    },
}
