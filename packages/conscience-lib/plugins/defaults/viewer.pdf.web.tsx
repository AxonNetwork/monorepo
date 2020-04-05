import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import urljoin from 'url-join'
import { IFileViewerPluginProps } from '../types'
import { directEmbedPrefix } from 'conscience-components/env-specific'


class PDFViewerPlugin extends React.Component<IFileViewerPluginProps>
{
    render() {
        const { uri, classes } = this.props

        return (
            <Card>
                <CardContent classes={{ root: classes.pdfRoot }}>
                    <embed src={urljoin(directEmbedPrefix(uri), uri.filename || '')} style={{ maxWidth: '100%' }} />
                </CardContent>
            </Card>
        )
    }
}

const styles = () => createStyles({
    pdfRoot: {
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
    pluginType: 'file editor',
    name: 'pdf-viewer',
    humanName: 'Default PDF viewer',
    viewer: withStyles(styles)(PDFViewerPlugin),
    widthMode: 'breakpoints',
}
