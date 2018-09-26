import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'

import Timeline from './Timeline/Timeline'
import Thread from './Discussion/Thread'

import { ITimelineEvent } from '../../../common'
import autobind from 'utils/autobind'

export interface RepoTimelinePageProps {
    folderPath: string
    timeline: ITimelineEvent[]
    getDiff: Function
    revertFiles: Function
    classes: any
}

export interface RepoTimelinePageState {
    selected: number|undefined
}

@autobind
class RepoTimelinePage extends React.Component<RepoTimelinePageProps, RepoTimelinePageState>
{
    state = {
        selected: undefined,
    }

    selectEvent(version: number|undefined) {
        this.setState({ selected: version })
    }

    render() {
        const { folderPath, timeline, getDiff, revertFiles, classes } = this.props
        return (
            <div className={classes.infoContainer}>
                <div className={classes.timeline}>
                    <Timeline
                        folderPath={folderPath}
                        timeline={timeline}
                        getDiff={getDiff}
                        revertFiles={revertFiles}
                        selectEvent={this.selectEvent}
                    />
                </div>
                {this.state.selected &&
                    <div className={classes.thread}>
                        <Thread
                            title={'Version ' + this.state.selected}
                            type="event"
                            subject={this.state.selected}
                            unselect={() => this.selectEvent(undefined)}
                        />
                    </div>
                }
            </div>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    infoContainer: {
        display: 'flex',
        height: '100%',
        paddingBottom: 80,
    },
    timeline: {
        flexGrow: 1,
        width: 0,
        marginRight: 32,
        overflowX: 'hidden',
        overflowY: 'scroll',
    },
    thread: {
        marginTop: theme.spacing.unit * 4,
        flexGrow: 1,
        width: 0,
        marginLeft: 32,
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        maxHeight: '90%',
    },

})

export default withStyles(styles)(RepoTimelinePage)
