import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ControlPointIcon from '@material-ui/icons/ControlPoint'

import Thread from './Discussion/Thread'
import CreateDiscussion from './Discussion/CreateDiscussion'
import { getDiscussions, selectDiscussion, createDiscussion } from 'redux/discussion/discussionActions'
import { createComment } from 'redux/comment/commentActions'
import { IGlobalState } from 'redux/store'
import { IDiscussion, IComment } from 'common'


class RepoDiscussionPage extends React.Component<Props>
{
    componentWillMount() {
        // @@TODO: intelligent caching
        this.props.getDiscussions({ repoID: this.props.repoID })
    }

    render() {
        const classes = this.props.classes
        const discussions = this.props.discussions || {}

        let selected: IDiscussion|undefined
        let newDiscussion = false
        if (this.props.selected !== undefined) {
            selected = discussions[this.props.selected]
            if (selected === undefined) {
                newDiscussion = true
            }
        }

        // @@TODO: probably better to sort these in the reducer or something
        const discussionsList = Object.keys(discussions).sort().map(created => discussions[parseInt(created, 10)]) // this sucks

        return (
            <div className={classes.discussionPage}>
                <List className={classes.list}>
                    {discussionsList.map(d => (
                        <React.Fragment key={d.created}>
                            <ListItem button className={classnames(classes.listItem, {[classes.selectedDiscussion]: d.created === this.props.selected})} key={d.created} onClick={() => this.props.selectDiscussion({ created: d.created })}>
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
                    <ListItem button className={classes.listItem} key={0} onClick={() => this.props.selectDiscussion({ created: -1 })}>
                        <ListItemText primary={'New Discussion'} />
                        <ListItemIcon>
                            <ControlPointIcon />
                        </ListItemIcon>
                    </ListItem>
                    <Divider />
                </List>
                {newDiscussion &&
                    <div className={classes.threadPane}>
                            <CreateDiscussion
                                repoID={this.props.repoID}
                                createDiscussion={this.props.createDiscussion}
                                unselect={() => this.props.selectDiscussion({ created: undefined })}
                            />
                    </div>
                }
                {selected !== undefined &&
                    <div className={classes.threadPane}>
                        <Thread
                            title={(selected as IDiscussion).subject}
                            type="discussion"
                            subject={(selected as IDiscussion).created}
                            unselect={() => this.props.selectDiscussion({ created: undefined })}
                            switchToPage={this.props.switchToPage}
                            files={(this.props.repo || {}).files || []}
                        />
                    </div>
                }
            </div>
        )
    }
}

interface Props {
    repoID: string
    repo: IRepo|undefined
    discussions: {[created: number]: IDiscussion}
    comments: {[id: number]: IComment}
    selected: number|undefined
    getDiscussions: Function
    selectDiscussion: typeof selectDiscussion
    createDiscussion: Function
    createComment: Function
    switchToPage: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    discussionPage: {
        maxHeight: 'calc(100% - 84px)',
        border: '1px solid',
        borderColor: theme.palette.grey[300],
        display: 'flex',
    },
    list: {
        height: '100%',
        padding: 0,
        overflow: 'auto',
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
    selectedDiscussion: {
        backgroundColor: '#cee2f1',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selected] || {}
    const repoID = repo.repoID || ''
    return {
        repo,
        repoID: repoID,
        discussions: state.discussion.discussions[repoID] || {},
        comments: state.comment.comments[repoID] || {},
        selected: state.discussion.selected,
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

