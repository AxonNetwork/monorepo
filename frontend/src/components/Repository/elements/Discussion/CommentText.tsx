import path from 'path'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import autobind from 'utils/autobind'


@autobind
class CommentText extends React.Component<Props>
{
    render() {
        const { username, created, text, repoRoot, classes } = this.props
        return (
            <div className={classes.comment}>
                <Typography className={classes.commentHeader}><strong>{username}</strong> <small>({moment(created).fromNow()})</small></Typography>
                <div className={classes.commentBody}>
                    <RenderMarkdown
                        text={text}
                        basePath={repoRoot}
                    />
                </div>
            </div>
        )
    }
}

interface Props {
    username: string
    created: number
    text: string
    classes: any
    repoRoot: string
}

const styles = (theme: Theme) => createStyles({
    comment: {
        margin: theme.spacing.unit * 2,
        padding: 0,
        border: '1px solid #e2e2e2',
        borderRadius: 6,
        backgroundColor: 'white',
        flexGrow: 1,
    },
    commentHeader: {
        backgroundColor: '#f1f1f1',
        padding: '8px 12px',
        borderBottom: '1px solid #e2e2e2',
        color: '#545454',
    },
    commentBody: {
        padding: theme.spacing.unit * 2,

        '& p': {
            paddingBottom: 6,
        },
    },
})

export default withStyles(styles)(CommentText)
