import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { autobind } from 'conscience-lib/utils'
import { URI } from 'conscience-lib/common'
import { IGlobalState } from 'conscience-components/redux'
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
        selectDiscussion(this.props.uri, this.props.discussionID)
    }
}

type Props = OwnProps & StateProps & { classes: any }

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

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        discussionSubject: (state.discussion.discussions[ownProps.discussionID] || {}).subject,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(DiscussionLink))
