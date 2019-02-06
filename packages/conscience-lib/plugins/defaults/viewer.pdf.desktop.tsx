import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import urljoin from 'url-join'
import { Document, Page } from 'react-pdf'
import { IFileViewerPluginProps } from '../types'
import { directEmbedPrefix } from 'conscience-components/env-specific'


class PDFViewerPlugin extends React.Component<IFileViewerPluginProps, State>
{
    state = {
        numPages: 0,
    }

    render() {
        const { uri, classes } = this.props

        // const platform = getPlatformName()
        // let viewer: JSX.Element
        // if (platform === 'web') {
        //     viewer = <embed src={urljoin(directEmbedPrefix(uri), uri.filename || '')} style={{ maxWidth: '100%' }} />
        // } else if (platform === 'desktop') {
        //     viewer =
        // }

        const pdfURL = urljoin(directEmbedPrefix(uri), uri.filename || '')

        return (
            <Card>
                <CardContent classes={{ root: classes.pdfRoot }}>
                    <div className={classes.container}>
                        <Document
                            file={pdfURL}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            className={classes.document}
                        >
                            {Array.from(new Array(this.state.numPages), (_, i) => (
                                <Page
                                    key={`page_${i + 1}`}
                                    pageNumber={i + 1}
                                    scale={1.3}
                                    className={classes.page}
                                />
                            ))}
                        </Document>
                    </div>
                </CardContent>
            </Card>
        )
    }

    onDocumentLoadSuccess = (info: { numPages: number }) => {
        this.setState({ numPages: info.numPages })
    }
}

interface State {
    numPages: number
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
    container: {
        maxHeight: 900,
        overflowY: 'auto',
        backgroundColor: '#505050',
    },
    document: {
        width: 'fit-content',
        margin: '0 auto',
    },
    page: {
        width: 'fit-content',
        marginBottom: 10,
    },
})

export default {
    pluginType: 'file viewer',
    name: 'pdf-viewer',
    humanName: 'Default PDF viewer',
    viewer: withStyles(styles)(PDFViewerPlugin),
    widthMode: 'breakpoints',
}
