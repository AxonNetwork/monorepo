import parse from 'parse-diff'
import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import FileViewer from 'conscience-components/FileViewer'
import { URI } from 'conscience-lib/common'


class BinaryDiff extends React.Component<Props>
{
    render() {
        const { classes, fileDiff } = this.props

        if (!fileDiff) {
            return null
        }

        return (
            <div className={classes.root}>
                <FileViewer
                    uri={{ ...this.props.uri, filename: fileDiff.to }}
                    showViewerPicker
                    classes={{
                        root: classes.fileViewerRoot,
                        // viewerPicker: classes.fileViewerViewerPicker,
                    }} />
            </div>
        )

        // const changes = file.chunks.reduce((acc: parse.Change[], curr: parse.Chunk) => {
        //     return acc.concat(curr.changes)
        // }, [])
        // const chunkCounts = changes.filter((ch: any) => ch.content.indexOf('chunks') > -1)
        // const chunkTotal = parseInt(chunkCounts[chunkCounts.length - 1].content.split(' ')[1])
        // const adds = changes.filter((ch: any) => ch.add)
        // const dels = changes.filter((ch: any) => ch.del)

        // let chunks = []
        // for (let i = 3; i < (chunkTotal + 3); i++) {
        //     let changed = false
        //     if (adds.some(((ch: any) => ch.ln && ch.ln === i))) {
        //         chunks.push('add')
        //         changed = true
        //     }
        //     if (dels.some(((ch: any) => ch.ln && ch.ln === i))) {
        //         chunks.push('del')
        //         changed = true
        //     }
        //     if (!changed) {
        //         chunks.push('normal')
        //     }
        // }
        // return (
        //     <Card className={classes.card}>
        //         <CardContent>
        //             <code className={classes.header}>{`${file.to}: ${chunkTotal} chunks: ${adds.length} added and ${dels.length} deleted`}</code>
        //             {chunks.map((ch, i) => {
        //                 let chunkClass = classes.chunk
        //                 if (ch === 'add') { chunkClass = chunkClass + ' ' + classes.add }
        //                 if (ch === 'del') { chunkClass = chunkClass + ' ' + classes.del }
        //                 return <div key={i} className={chunkClass}></div>
        //             })}
        //         </CardContent>
        //     </Card>
        // )
    }
}

interface Props {
    uri: URI
    fileDiff: parse.File
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: '#cecece',
    },
    fileViewerRoot: {
        margin: '0 auto',
        width: 'fit-content',
        maxWidth: '100%',
    },
    fileViewerViewerPicker: {
        display: 'block',
    },
    // chunk: {
    //     width: 16,
    //     height: 16,
    //     display: 'inline-block',
    //     margin: 2,
    //     border: '1px solid',
    //     borderColor: theme.palette.grey[900],
    //     backgroundColor: theme.palette.grey[200],
    // },
    // add: {
    //     backgroundColor: green[500],
    // },
    // del: {
    //     backgroundColor: red[500],
    // },
    // header: {
    //     color: theme.palette.secondary.main,
    //     fontWeight: 'bold',
    //     display: 'block',
    //     marginBottom: 16,
    // },
})

export default withStyles(styles)(BinaryDiff)
