import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CodeViewer from '../CodeViewer'
import Conflict from './Conflict'
import Breadcrumbs from '../Breadcrumbs'
import { selectFile } from '../navigation'
import { getFileContents, saveFileContents } from '../env-specific'

import { FileMode, LocalURI } from 'conscience-lib/common'
import { ChunkType, IChunk, IChunkConflict, IChunkNoConflict, parseMergeConflict, combineChunks } from 'conscience-lib/utils'
import { autobind } from 'conscience-lib/utils'
import path from 'path'


@autobind
class MergeConflictResolver extends React.Component<Props, State>
{
    state = {
        chunks: [] as IChunk[]
    }

    async componentDidMount() {
        const contents = (await getFileContents(this.props.uri, { as: 'string' })) as string
        const chunks = parseMergeConflict(contents)
        this.setState({ chunks })
    }

    render() {
        const { uri, classes } = this.props
        const { chunks } = this.state
        const language = path.extname(uri.filename || '').toLowerCase().substring(1)

        return (
            <div>
                <Breadcrumbs
                    uri={this.props.uri}
                    classes={{ root: classes.breadcrumbs }}
                />
                <Typography variant="h6" className={classes.title}>
                    Resolve Merge Conflicts
                </Typography>

                {
                    chunks.map((ch, i) => {
                        if (ch.type === ChunkType.NoConflict) {
                            const content = ch.lines.join("\n")
                            if (content === "") {
                                return null
                            }
                            return (
                                <Card className={classes.chunk}>
                                    <CardContent>
                                        <CodeViewer
                                            language={language}
                                            fileContents={content}
                                            classes={{ codeContainer: classes.codeContainer }}
                                        />
                                    </CardContent>
                                </Card>
                            )
                        }
                        if (ch.type === ChunkType.Conflict) {
                            return (
                                <div className={classes.chunk}>
                                    <Conflict
                                        language={language}
                                        chunk={ch as IChunkConflict}
                                        onAccept={(content: string) => this.chunkContentAccepted(content, i)}
                                        classes={{ codeContainer: classes.codeContainer }}
                                    />
                                </div>
                            )
                        }
                        return null
                    })
                }
            </div>
        )
    }

    async chunkContentAccepted(chunkContent: string, index: number) {
        const chunks = this.state.chunks
        const oldChunk = chunks[index]
        const newChunk = {
            type: ChunkType.NoConflict,
            lineStart: oldChunk.lineStart,
            lines: chunkContent.split("\n")
        } as IChunkNoConflict
        chunks.splice(index, 1, newChunk)

        const newContent = combineChunks(chunks)
        try {
            await saveFileContents(this.props.uri, newContent)
        } catch (err) {
            console.error('error saving ~>', err)
        }
        const reParsed = parseMergeConflict(newContent)
        this.setState({ chunks: reParsed })

        // if no more conflicts, switch to viewer
        if (reParsed.length === 1) {
            selectFile(this.props.uri, FileMode.View)
        }
    }
}

interface Props {
    uri: LocalURI
    classes: any
}

interface State {
    chunks: IChunk[]
}

const styles = (theme: Theme) => createStyles({
    title: {
        marginBottom: theme.spacing.unit
    },
    chunk: {
        marginBottom: theme.spacing.unit
    },
    codeContainer: {
        padding: 0,
        overflowX: 'hidden',
    },
    breadcrumbs: {
        marginBottom: theme.spacing.unit * 2
    }
})

export default withStyles(styles)(MergeConflictResolver)
