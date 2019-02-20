import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import Thread from '../Thread'
import CreateDiscussion from '../CreateDiscussion'
import DiscussionList from '../DiscussionList'
import { selectDiscussion } from '../navigation'
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
                    selectedID={selectedID}
                    classes={{ list: classes.discussionList }}
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

    selectDiscussion(discussionID: string | undefined) {
        selectDiscussion(this.props.uri, discussionID)
    }
}


interface Props {
    uri: URI
    selectedID: string | undefined
    classes: any
}

const styles = (theme: Theme) => createStyles({
    discussionPane: {
        height: 'calc(100% - 80px)',
        display: 'flex',
    },
    discussionList: {
        height: '100%',
        padding: 0,
        overflow: 'auto',
        flexGrow: 1,
        width: 400,
        border: '1px solid #e0e0e0',
    },
    threadPane: {
        position: 'relative',
        marginLeft: 20,
        height: '100%',
        width: '100%',
        flexGrow: 5,
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
})

export default withStyles(styles)(DiscussionPane)
