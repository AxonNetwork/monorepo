import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Timeline from './Timeline/Timeline'
import Thread from './Discussion/Thread'

class RepoTimelinePage extends Component
{
    state = {
        selected: undefined,
    }

    constructor(props) {
        super(props)
        this.selectEvent = this.selectEvent.bind(this)
    }

    selectEvent(version) {
        this.setState({ selected: version })
    }

    render() {
        const classes = this.props.classes
        return (
            <div className={classes.infoContainer}>
                <div className={classes.timeline}>
                    <Timeline
                        folderPath={this.props.folderPath}
                        timeline={this.props.timeline}
                        getDiff={this.props.getDiff}
                        revertFiles={this.props.revertFiles}
                        selectEvent={this.selectEvent}
                    />
                </div>
                {this.state.selected &&
                    <div className={classes.thread}>
                        <Thread
                            title={"Version "+this.state.selected}
                            type='event'
                            subject={this.state.selected}
                            unselect={()=>this.selectEvent(undefined)}
                        />
                    </div>
                }
            </div>
        )
    }
}

RepoTimelinePage.propTypes = {
    folderPath: PropTypes.string.isRequired,
    timeline: PropTypes.array.isRequired,
    getDiff: PropTypes.func.isRequired,
    revertFiles: PropTypes.func.isRequired,
}

const styles = theme => ({
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
        marginTop: theme.spacing.unit*4,
        flexGrow: 1,
        width: 0,
        marginLeft: 32,
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        maxHeight: '90%',
    },

})

export default withStyles(styles)(RepoTimelinePage)
