import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CodeViewer from '../CodeViewer'
import Conflict from './Conflict'

import { IGlobalState } from 'redux/store'
import { ChunkType, IChunk, IChunkConflict, IChunkNoConflict, parseMergeConflict, combineChunks } from 'utils/mergeConflict'
import fs from 'fs'
import path from 'path'
import autobind from 'utils/autobind'


@autobind
class MergeConflictResolver extends React.Component<Props, State>
{
    state={
        chunks: [] as IChunk[]
    }

    componentDidMount(){
        const { repoRoot, filename } = this.props
        const fileContents = fs.readFileSync(path.join(repoRoot, filename), { encoding: 'utf8' })
        const chunks = parseMergeConflict(fileContents)
        this.setState({ chunks })
    }

    render() {
        const { filename, classes } = this.props
        const { chunks } = this.state
        const language = path.extname(filename).toLowerCase().substring(1)

        return (
            <div>
            {
                chunks.map((ch, i) => {
                    if(ch.type === ChunkType.NoConflict){
                        const content = ch.lines.join("\n")
                        return (
                            <Card className={classes.chunk}>
                                <CardContent>
                                    <CodeViewer
                                        language={language}
                                        contents={content}
                                        classes={{codeContainer: classes.codeContainer}}
                                    />
                                </CardContent>
                            </Card>
                        )
                    }
                    if(ch.type === ChunkType.Conflict){
                        return (
                            <Card className={classes.chunk}>
                                <CardContent>
                                    <Conflict
                                        language={language}
                                        chunk={ch as IChunkConflict}
                                        onAccept={(content: string)=>this.chunkContentAccepted(content, i)}
                                        classes={{codeContainer: classes.codeContainer}}
                                    />
                                </CardContent>
                            </Card>
                        )
                    }
                    return null
                })
            }
            </div>
        )
    }

    chunkContentAccepted(chunkContent: string, index: number){
        const chunks = this.state.chunks
        const oldChunk = chunks[index]
        const newChunk = {
            type: ChunkType.NoConflict,
            lineStart: oldChunk.lineStart,
            lines: chunkContent.split("\n")
        } as IChunkNoConflict
        chunks.splice(index, 1, newChunk)

        const newContent = combineChunks(chunks)
        const filepath = path.join(this.props.repoRoot, this.props.filename)
        try{
            fs.writeFileSync(filepath, newContent, {encoding: 'utf8'})
        }catch(err){
            console.error('error saving ~>', err)
        }
        const reParsed = parseMergeConflict(newContent)
        this.setState({ chunks: reParsed })
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    repoRoot: string
    filename: string
}

interface StateProps {}

interface DispatchProps {}

interface State {
    chunks: IChunk[]
}

const styles = (theme: Theme) => createStyles({
    chunk: {
        marginBottom: theme.spacing.unit
    },
    codeContainer: {
        padding: 0,
        overflowX: 'hidden',
    }
})


const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {}
}

const mapDispatchToProps = {}

export default connect< StateProps, DispatchProps, OwnProps, IGlobalState >(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(MergeConflictResolver))
