import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { navigateRepoPage } from 'redux/repository/repoActions'
import { selectDiscussion } from 'redux/discussion/discussionActions'
import { RepoPage } from 'redux/repository/repoReducer'
import { IGlobalState } from 'redux/store'
import autobind from 'utils/autobind'

@autobind
class DiscussionLink extends React.Component<Props>
{
    render() {
        const { discussionSubject, classes } = this.props
        return (
            <a className={classes.link} onClick={this.onClick}>
                {discussionSubject}
            </a>
        )
    }

    onClick() {
        this.props.selectDiscussion({ created: this.props.discussionID })
        this.props.navigateRepoPage({ repoPage: RepoPage.Discussion })
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    discussionID: number
}

interface StateProps {
    discussionSubject: string
}

interface DispatchProps {
    navigateRepoPage: typeof navigateRepoPage
    selectDiscussion: typeof selectDiscussion
}

const styles = (theme: Theme) => createStyles({
    link: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repoPath = state.repository.selectedRepo || ''
    const repoID = (state.repository.repos[repoPath] || {}).repoID || ''
    const discussionSubject = (((state.discussion.discussions[ repoID ] || {})[ ownProps.discussionID ]) || {}).subject
    return {
        discussionSubject,
    }
}

const mapDispatchToProps = {
    selectDiscussion,
    navigateRepoPage,
}

export default connect< StateProps, DispatchProps, OwnProps, IGlobalState >(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(DiscussionLink))
