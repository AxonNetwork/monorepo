import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ControlPointIcon from '@material-ui/icons/ControlPoint'

import Thread from './Discussion/Thread'
import CreateDiscussion from './Discussion/CreateDiscussion'
import { getDiscussions, selectDiscussion, createDiscussion, createComment } from '../../../redux/discussion/discussionActions'

class RepoDiscussionPage extends Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.props.getDiscussions(this.props.repoID)
    }

    selectDiscussion = (created) => {
        this.props.selectDiscussion(created)
    }

    render() {
        const classes = this.props.classes
        const discussions = this.props.discussions || []
        let selected
        let filteredComments = []
        if (this.props.selected !== undefined) {
            selected = discussions.find(d => d.created === this.props.selected)
            if (selected !== undefined) {
                filteredComments = (this.props.comments || []).filter(c => c.attachedTo.subject === selected.created)
            } else {
                selected = 'new'
            }
        }

        return (
            <div className={classes.discussionPage}>
                <List className={classes.list}>
                    {discussions.map(d => (
                        <React.Fragment key={d.created}>
                            <ListItem button className={classes.listItem} key={d.created} onClick={() => this.selectDiscussion(d.created)}>
                                {selected === undefined &&
                                    <React.Fragment>
                                        <ListItemText primary={d.subject} secondary={d.email}/>
                                        <ListItemIcon>
                                            <ChevronRightIcon />
                                        </ListItemIcon>
                                    </React.Fragment>
                                }
                                {selected !== undefined &&
                                    <ListItemText primary={d.subject} secondary={d.email}/>
                                }
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                    <ListItem button className={classes.listItem} key={0} onClick={() => this.selectDiscussion(0)}>
                        <ListItemText primary={'New Discussion'} />
                        {selected === undefined &&
                            <ListItemIcon>
                                <ControlPointIcon />
                            </ListItemIcon>
                        }
                    </ListItem>
                    <Divider />
                </List>
                {selected !== undefined &&
                    <div className={classes.threadPane}>
                        {selected === 'new' &&
                            <CreateDiscussion
                                repoID={this.props.repoID}
                                createDiscussion={this.props.createDiscussion}
                                unselect={() => this.props.selectDiscussion(undefined)}
                            />
                        }
                        {selected !== 'new' &&
                            <Thread
                                title={selected.subject}
                                type="discussion"
                                subject={selected.created}
                                unselect={() => this.props.selectDiscussion(undefined)}
                            />
                        }
                    </div>
                }
            </div>
        )
    }
}

RepoDiscussionPage.propTypes = {
    repoID: PropTypes.string.isRequired,
    discussions: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    user: PropTypes.string.isRequired,
    selected: PropTypes.number,
    getDiscussions: PropTypes.func.isRequired,
    selectDiscussion: PropTypes.func.isRequired,
    createDiscussion: PropTypes.func.isRequired,
    createComment: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({
    discussionPage: {
        position: 'relative',
        height: 'calc(100% - 84px)',
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        display: 'flex',
    },
    list: {
        height: '100%',
        padding: 0,
        overflow: 'scroll',
        flexGrow: 1,
        width: 350,
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
    },
    threadPane: {
        borderLeft: '1px solid',
        borderColor: theme.palette.grey[300],
        height: '100%',
        width: '100%',
        flexGrow: 5,
    },
})

const mapStateToProps = (state, ownProps) => {
    const repoID = state.repository.repos[state.repository.selectedRepo].repoID
    return {
        repoID: repoID,
        discussions: state.discussion.discussions,
        comments: state.discussion.comments,
        selected: state.discussion.selected,
        user: state.user.name,
    }
}

const mapDispatchToProps = {
    getDiscussions,
    selectDiscussion,
    createDiscussion,
    createComment,
}

const RepoDiscussionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoDiscussionPage))

export default RepoDiscussionPageContainer

