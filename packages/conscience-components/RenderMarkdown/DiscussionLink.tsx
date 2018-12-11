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
        this.props.onSelectDiscussion(this.props.discussionID)
    }
}

interface Props {
    discussionID: string
    onSelectDiscussion: (discussionID: string) => void
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
