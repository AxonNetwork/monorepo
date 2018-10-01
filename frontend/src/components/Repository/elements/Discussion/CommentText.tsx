import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import FileLink from './FileLink'

function replaceLinks(text: string){
    let parts = text.split('@file:[')
    let elems = []
    elems.push(
        <span>{parts[0]}</span>
    )
    for(var i=1; i<parts.length; i++){
        const part = parts[i]
        const endIndex = part.indexOf(']')
        const reference = part.substring(0, endIndex)
        elems.push(
            <FileLink fileRef={reference} />
        )
        elems.push(
            <span>{part.substring(endIndex+1)}</span>
        )
    }
    return(
        <React.Fragment>
            {elems}
        </React.Fragment>
    )
}

export interface Props {
    username: string
    created: number
    text: string
    classes: any
}

function CommentText(props: Props) {
    const { username, created, text, classes } = props
    let displayText = text

    return (
        <div className={classes.comment}>
            <Typography className={classes.commentHeader}><strong>{username}</strong> <small>({moment(created).fromNow()})</small></Typography>
            <div className={classes.commentBody}>
                {displayText.split('\n').map((p, i) => (
                    <Typography className={classes.commentText} key={i}>
                        {replaceLinks(p)}
                    </Typography>
                ))}
            </div>
        </div>
    )
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
