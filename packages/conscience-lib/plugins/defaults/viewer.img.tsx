import urljoin from 'url-join'
import React from 'react'
import { IFileViewerPluginProps } from '../index'
import { directEmbedPrefix } from 'conscience-components/env-specific'

export default {
    pluginType: 'file viewer',
    name: 'img-viewer',
    humanName: 'Default image viewer',
    viewer: function(props: IFileViewerPluginProps) {
        const { uri } = props
        return (
            <img src={urljoin(directEmbedPrefix(uri), uri.filename || '')} style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }} />
        )
    },
}
