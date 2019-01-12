import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { autobind } from 'conscience-lib/utils'

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
        const discussionID = this.props.discussionID
        this.props.selectDiscussion({ discussionID })
    }
}

interface Props {
    discussionID: string
    selectDiscussion: (payload: { discussionID: string | undefined }) => void
    discussionSubject: string
    classes: any
}

const styles = (theme: Theme) => createStyles({
    link: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
})

export default (withStyles(styles)(DiscussionLink))
