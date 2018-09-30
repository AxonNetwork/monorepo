import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import Timeline from './Timeline/Timeline'
import Thread from './Discussion/Thread'
import { IGlobalState } from 'redux/store'
import { getDiff, revertFiles } from 'redux/repository/repoActions'
import { ITimelineEvent } from 'common'
import autobind from 'utils/autobind'

@autobind
class RepoTimelinePage extends React.Component<Props, State>
{
    state = {
        selected: undefined,
    }

    selectEvent(version: number|undefined) {
        this.setState({ selected: version })
    }

    render() {
        const { repoRoot, timeline, getDiff, revertFiles, classes } = this.props
        return (
            <div className={classes.infoContainer}>
                <div className={classes.timeline}>
                    <Timeline
                        repoRoot={repoRoot}
                        timeline={timeline}
                        getDiff={getDiff}
                        revertFiles={revertFiles}
                        selectEvent={this.selectEvent}
                    />
                </div>
                {this.state.selected !== undefined &&
                    <div className={classes.thread}>
                        <Thread
                            title={'Version ' + this.state.selected}
                            type="event"
                            subject={this.state.selected || -1}
                            unselect={() => this.selectEvent(undefined)}
                        />
                    </div>
                }
            </div>
        )
    }
}

interface Props {
    repoRoot: string
    timeline: ITimelineEvent[]
    getDiff: Function
    revertFiles: Function
    classes: any
}

interface State {
    selected: number|undefined
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
        overflowY: 'auto',
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

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selected] || {}
    return {
        repoRoot: repo.path,
        timeline: repo.timeline || [],
    }
}

const mapDispatchToProps = {
    getDiff,
    revertFiles,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(RepoTimelinePage))
