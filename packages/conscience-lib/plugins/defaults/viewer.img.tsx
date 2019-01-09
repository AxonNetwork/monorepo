import url from 'url'
import React from 'react'

export default {
    pluginType: 'file viewer',
    name: 'img',
    viewer: function (props: { directEmbedPrefix: string, filename: string, fileContents?: string }) {
        const { directEmbedPrefix, filename } = props

        let src: string
        if (directEmbedPrefix.endsWith('/')) {
            if (filename.startsWith('/')) {
                src = directEmbedPrefix.slice(0, -1) + filename
            } else {
                src = directEmbedPrefix + filename
            }
        } else {
            if (filename.startsWith('/')) {
                src = directEmbedPrefix + filename
            } else {
                src = directEmbedPrefix + '/' + filename
            }
        }

        return (
            <img src={src} className={null /*classes.imageEmbed*/} />
        )
    },
}
