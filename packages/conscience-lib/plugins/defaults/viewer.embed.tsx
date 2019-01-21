import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import urljoin from 'url-join'
import { IFileViewerPluginProps } from '../index'
import { directEmbedPrefix } from 'conscience-components/env-specific'


function EmbedViewerPlugin(props: IFileViewerPluginProps) {
    const { uri, classes } = props
    return (
        <Card>
            <CardContent classes={{ root: classes.embedRoot }}>
                <embed src={urljoin(directEmbedPrefix(uri), uri.filename || '')} style={{ maxWidth: '100%' }} />
            </CardContent>
        </Card>
    )
}

const styles = () => createStyles({
    embedRoot: {
        padding: 0,
        paddingBottom: '0 !important',
        minWidth: 680,

        '& embed': {
            width: '100%',
            height: 800,
        },
    },
})

export default {
    pluginType: 'file viewer',
    name: 'embed-viewer',
    humanName: 'Default embed viewer',
    viewer: withStyles(styles)(EmbedViewerPlugin),
}
