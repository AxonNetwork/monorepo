import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import parse from 'parse-diff'

import LineChunkContent from './LineChunkContent'
import SheetChunkContent from './SheetChunkContent'
import { autobind } from 'conscience-lib/utils'
import * as filetypes from 'conscience-lib/utils/fileTypes'

@autobind
class TextDiff extends React.Component<Props, State>
{
    render() {
        const { fileDiff, classes } = this.props
        const language = fileDiff.to ? filetypes.getLanguage(fileDiff.to) : undefined
        const type = fileDiff.to ? filetypes.getType(fileDiff.to) : undefined

        return (
            <React.Fragment>
                {fileDiff.chunks.map((chunk, i) => (
                    <React.Fragment>
                        <div>
                            {type !== 'data' &&
                                <LineChunkContent chunk={chunk} codeColorScheme={this.props.codeColorScheme} language={language} />
                            }
                            {type === 'data' &&
                                <SheetChunkContent chunk={chunk} />
                            }
                        </div>
                        {i < fileDiff.chunks.length - 1 &&
                            <div className={classes.diffBreakMarker}>...</div>
                        }
                    </React.Fragment>
                ))}
            </React.Fragment>
        )
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    fileDiff: parse.File
    codeColorScheme?: string | undefined
}

interface State {
    expanded: boolean
}

const styles = (theme: Theme) => createStyles({
    diffBreakMarker: {
        padding: 15,
        backgroundColor: '#eff7ff',
    },
})

export default withStyles(styles)(TextDiff)
