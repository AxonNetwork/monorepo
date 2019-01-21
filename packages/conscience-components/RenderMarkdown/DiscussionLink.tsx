import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { autobind } from 'conscience-lib/utils'
import { IDiscussionState } from 'conscience-components/redux/discussion/discussionReducer'


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
        const { repoID, discussionID } = this.props
        this.props.history.push(`/repo/${repoID}/discussion/${discussionID}`)
    }
}

type Props = OwnProps & StateProps & RouteComponentProps<{}> & { classes: any }

interface OwnProps {
    repoID: string
    discussionID: string
}

interface StateProps {
    discussionSubject: string
}

const styles = (theme: Theme) => createStyles({
    link: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
})

const mapStateToProps = (state: { discussion: IDiscussionState }, ownProps: OwnProps) => {
    return {
        discussionSubject: (state.discussion.discussions[ownProps.discussionID] || {}).subject,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(withRouter(DiscussionLink)))
