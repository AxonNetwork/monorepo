import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'

import Thread from '../Thread'
import CreateDiscussion from '../CreateDiscussion'
import DiscussionList from '../DiscussionList'
import { selectDiscussion } from '../navigation'
import { getDiscussions } from '../redux/discussion/discussionActions'
import { IGlobalState } from '../redux'
import { getRepo } from '../env-specific'

import { URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class DiscussionPane extends React.Component<Props>
{
    render() {
        const { selectedID, classes } = this.props

        const newDiscussion = selectedID === 'new' // @@TODO: shitty

        return (
            <div className={classes.discussionPane}>
                <DiscussionList
                    uri={this.props.uri}
                    order={this.props.discussionIDsSortedByNewestComment}
                    selectedID={selectedID}
                />
                {newDiscussion &&
                    <div className={classes.threadPane}>
                        <IconButton onClick={() => this.selectDiscussion(undefined)} className={classes.closeNewDiscussionPanelButton}>
                            <CancelIcon />
                        </IconButton>
                        <Typography variant="title" className={classes.startNewDiscussionPrompt}>Start a new discussion</Typography>
                        <CreateDiscussion uri={this.props.uri} />
                    </div>
                }
                {!newDiscussion && selectedID !== undefined &&
                    <div className={classes.threadPane}>
                        <Thread
                            uri={this.props.uri}
                            discussionID={selectedID}
                            unselect={() => this.selectDiscussion(undefined)}
                        />
                    </div>
                }
            </div>
        )
    }

    componentWillMount() {
        // @@TODO: intelligent caching
        this.props.getDiscussions({ uri: this.props.uri })
    }

    selectDiscussion(discussionID: string | undefined) {
        selectDiscussion(this.props.uri, discussionID)
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
    selectedID: string | undefined
}

interface StateProps {
    discussionIDsSortedByNewestComment: string[]
}

interface DispatchProps {
    getDiscussions: typeof getDiscussions
}

const styles = (theme: Theme) => createStyles({
    discussionPane: {
        height: 'calc(100% - 80px)',
        display: 'flex',
    },
    list: {
        height: '100%',
        padding: 0,
        overflow: 'auto',
        flexGrow: 1,
        width: 350,
        borderTop: '1px solid #e0e0e0',
    },
    listItem: {
        background: 'white',
        borderTop: 0,
        border: '1px solid #e0e0e0',
    },
    listItemHover: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
    },
    threadPane: {
        position: 'relative',
        marginLeft: 20,
        height: '100%',
        width: '100%',
        flexGrow: 5,
    },
    selectedDiscussion: {
        backgroundColor: '#cee2f1',
    },
    closeNewDiscussionPanelButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: theme.spacing.unit,
    },
    startNewDiscussionPrompt: {
        fontSize: '1.8rem',
        padding: theme.spacing.unit,
    },
    sidebarListItemSubtext: {
        display: 'flex',
    },
    sidebarListItemModifiedDate: {
        flexGrow: 1,
    },
    sidebarListItemAvatar: {
        padding: 3,

        '& > div': {
            width: 22,
            height: 22,
            fontSize: '0.8rem',
        },
    },
    discussionBadge: {
        width: 9,
        height: 9,
        right: 'auto',
        top: -17,
        left: -15,
    },
    discussionBadgeWrapper: {
        display: 'block',
        height: 0,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repo = getRepo(ownProps.uri)
    const repoID = (repo || { repoID: '' }).repoID || ''

    return {
        discussionIDsSortedByNewestComment: (state.discussion.discussionIDsSortedByNewestComment[repoID] || []),
    }
}

const mapDispatchToProps = {
    getDiscussions,
}

export default connect<StateProps, DispatchProps, OwnProps, IGlobalState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(DiscussionPane))
