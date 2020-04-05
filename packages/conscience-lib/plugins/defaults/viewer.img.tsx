import urljoin from 'url-join'
import React from 'react'
import { IFileEditorPluginProps } from '../types'
import { directEmbedPrefix } from 'conscience-components/env-specific'

export default {
    pluginType: 'file editor',
    name: 'img-viewer',
    humanName: 'Default image viewer',
    editor: function(props: IFileEditorPluginProps) {
        const { uri } = props
        return (
            <img src={urljoin(directEmbedPrefix(uri), uri.filename || '')} style={{ maxWidth: '100%', display: 'block', margin: '0 auto' }} />
        )
    },
    widthMode: 'breakpoints',
}
