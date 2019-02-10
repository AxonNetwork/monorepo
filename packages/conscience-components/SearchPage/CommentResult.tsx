import React from 'react'
import { Link } from 'react-router-dom'
import ContentLoader from 'react-content-loader'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import UserAvatar from 'conscience-components/UserAvatar'
import { getDiscussionURL } from 'conscience-components/navigation'
import { IUser, IComment, IDiscussion, URIType } from 'conscience-lib/common'


class CommentResult extends React.Component<Props>
{
    render() {
        const { comment, discussion, user, classes } = this.props

        const commentURL = discussion && comment
            ? getDiscussionURL({ type: URIType.Network, repoID: discussion.repoID }, discussion.discussionID, comment.commentID)
            : ''

        return (
            <Link to={commentURL} className={classes.userLink}>
                <ListItem button={!!comment && !!discussion && !!user}>
                    {!(comment && discussion && user) &&
                        <div style={{width: 200, height: 64}}>
                            <CommentResultLoader />
                        </div>
                    }

                    {comment && discussion && user &&
                        <React.Fragment>
                            <ListItemAvatar>
                                <UserAvatar user={user} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                    <strong>{discussion.repoID}:</strong>{' '}
                                    {discussion.subject}
                                    </React.Fragment>
                                }
                                secondary={<div>{comment.text}</div>}
                            />
                        </React.Fragment>
                    }
                </ListItem>
            </Link>
        )
    }
}


const CommentResultLoader = () => (
    <ContentLoader
        height={64}
        width={200}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
    >
        <rect x="70" y="4" rx="4" ry="4" width="148.59" height="6.4" />
        <rect x="70" y="24" rx="3" ry="3" width="107.95" height="6.4" />
        <circle cx="30" cy="30" r="30" />
        <rect x="71" y="43" rx="4" ry="4" width="148.59" height="6.4" />
    </ContentLoader>
)

interface Props {
    discussion: IDiscussion | undefined
    comment: IComment | undefined
    user: IUser | undefined
    classes?: any
}

const styles = (theme: Theme) => createStyles({
    userLink: {
        textDecoration: 'none',
    },
})

export default withStyles(styles)(CommentResult)
