import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { autobind } from 'conscience-lib/utils'
import { URI } from 'conscience-lib/common'
import { IDiscussionState } from 'conscience-components/redux/discussion/discussionReducer'
import { selectDiscussion } from 'conscience-components/navigation'


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
        selectDiscussion(this.props.history, this.props.uri, this.props.discussionID)
    }
}

type Props = OwnProps & StateProps & RouteComponentProps<{}> & { classes: any }

interface OwnProps {
    uri: URI
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
