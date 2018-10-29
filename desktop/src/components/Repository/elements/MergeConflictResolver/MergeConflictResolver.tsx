import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CodeViewer from '../CodeViewer'
import Conflict from './Conflict'

import { IGlobalState } from 'redux/store'
import { ChunkType, parseMergeConflict } from 'utils/mergeConflict'
import fs from 'fs'
import path from 'path'
import autobind from 'utils/autobind'


@autobind
class MergeConflictResolver extends React.Component<Props, State>
{

    render() {
        const { repoRoot, filename, classes } = this.props
        const contents = fs.readFileSync(path.join(repoRoot, filename), { encoding: 'utf8' })
        const language = path.extname(filename).toLowerCase().substring(1)
        const chunks = parseMergeConflict(contents)

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
                    if(ch.type === ChunkType.Upstream){
                        return (
                            <Card className={classes.chunk}>
                                <CardContent>
                                    <Conflict
                                        language={language}
                                        upstreamChunk={ch}
                                        localChunk={chunks[i+1]}
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
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    repoRoot: string
    filename: string
}

interface StateProps {}

interface DispatchProps {}

interface State {}

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
