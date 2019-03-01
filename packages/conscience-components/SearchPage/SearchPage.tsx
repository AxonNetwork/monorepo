import uniq from 'lodash/uniq'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import CircularProgress from '@material-ui/core/CircularProgress'
import { search } from 'conscience-components/redux/search/searchActions'
import { H5, H6 } from 'conscience-components/Typography/Headers'
import { IGlobalState } from 'conscience-components/redux'
import { fetchUserData } from 'conscience-components/redux/user/userActions'
import { getDiscussions, getComments } from 'conscience-components/redux/discussion/discussionActions'
import { selectUser, getFileURL } from 'conscience-components/navigation'
import { ISearchResults, URIType, FileMode, IUser, IComment, IDiscussion } from 'conscience-lib/common'
import UserSearchResult from '../UserSearchResult'
import CommentSearchResult from '../CommentSearchResult'


class SearchPage extends React.Component<Props, State>
{
    state = {
        resultType: 'files' as 'files' | 'comments' | 'users',
    }

    render() {
        const { results, classes } = this.props
        if (!results) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }

        return (
            <div className={classes.container}>
                <main className={classes.main}>
                    <H5>Searching for "{this.props.match.params.query}"</H5>

                    <div className={classes.columnContainer}>
                        <Card className={classes.leftCol}>
                            <CardContent>
                                <List>
                                    <ListItem
                                        button={results.files.length > 0}
                                        classes={{ button: results.files.length > 0 ? classes.listItemHover : undefined }}
                                        onClick={results.files.length > 0 ? () => this.setState({ resultType: 'files' }) : undefined}
                                    >
                                        {results.files.length} files
                                    </ListItem>
                                    <ListItem
                                        button={results.comments.length > 0}
                                        classes={{ button: results.comments.length > 0 ? classes.listItemHover : undefined }}
                                        onClick={results.comments.length > 0 ? () => this.setState({ resultType: 'comments' }) : undefined}
                                    >
                                        {results.comments.length} comments
                                    </ListItem>
                                    <ListItem
                                        button={results.users.length > 0}
                                        classes={{ button: results.users.length > 0 ? classes.listItemHover : undefined }}
                                        onClick={results.users.length > 0 ? () => this.setState({ resultType: 'users' }) : undefined}
                                    >
                                        {results.users.length} users
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>

                        <Card className={classes.rightCol}>
                            <CardContent>
                                {this.state.resultType === 'files' &&
                                    <React.Fragment>
                                        <H6>Files</H6>
                                        <List>
                                            {results.files.map(file => (
                                                <ListItem>
                                                    <Link to={getFileURL({ type: URIType.Network, repoID: file.repoID, commit: 'HEAD', filename: file.filename }, FileMode.View)}>
                                                        <div>{file.repoID}</div>
                                                        <div>{file.filename}</div>
                                                    </Link>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </React.Fragment>
                                }

                                {this.state.resultType === 'comments' &&
                                    <React.Fragment>
                                        <H6>Comments</H6>
                                        <List>
                                            {results.comments.map(({ repoID, discussionID, commentID }) => {
                                                const comment = this.props.comments[commentID]
                                                const discussion = this.props.discussions[discussionID]
                                                const user = comment ? this.props.users[comment.userID] : undefined
                                                return <CommentSearchResult comment={comment} discussion={discussion} user={user} />
                                            })}
                                        </List>
                                    </React.Fragment>
                                }

                                {this.state.resultType === 'users' &&
                                    <React.Fragment>
                                        <H6>Users</H6>
                                        <List>
                                            {results.users.map(({ userID }) => (
                                                <UserSearchResult
                                                    user={this.props.users[userID]}
                                                    onClick={selectUser}
                                                />
                                            ))}
                                        </List>
                                    </React.Fragment>
                                }
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        )
    }

    componentWillMount() {
        const { query } = this.props.match.params
        this.props.search({ query })
    }

    componentDidUpdate(prevProps: Props) {
        const { query } = this.props.match.params
        if (query !== prevProps.match.params.query) {
            this.props.search({ query })
        }

        if (this.props.results && this.props.results !== prevProps.results) {
            const userIDs = uniq(this.props.results.users.map(x => x.userID))
            if (userIDs.length > 0) {
                this.props.fetchUserData({ userIDs })
            }

            const commentIDs = uniq(this.props.results.comments.map(x => x.commentID))
            const discussionIDs = uniq(this.props.results.comments.map(x => x.discussionID))
            if (commentIDs.length > 0) {
                this.props.getComments({ commentIDs })
            }
            if (discussionIDs.length > 0) {
                this.props.getDiscussions({ discussionIDs })
            }
        }
    }
}

type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps<MatchParams> & { classes: any }

interface OwnProps {
}

interface StateProps {
    results: ISearchResults | null
    users: { [userID: string]: IUser }
    comments: { [commentID: string]: IComment }
    discussions: { [commentID: string]: IDiscussion }
}

interface DispatchProps {
    search: typeof search
    fetchUserData: typeof fetchUserData
    getDiscussions: typeof getDiscussions
    getComments: typeof getComments
}

interface MatchParams {
    query: string
}

interface State {
    resultType: 'files' | 'comments' | 'users'
}

const styles = (theme: Theme) => createStyles({
    container: {
        // justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    main: {
        width: 1024,
        marginTop: 32,
    },
    columnContainer: {
        display: 'flex',
        width: '100%',
    },
    leftCol: {
        width: 220,
        marginRight: 20,
    },
    rightCol: {
        flexGrow: 1,
    },
    listItemHover: {
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    },
    userLink: {
        textDecoration: 'none',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
    return {
        results: state.search.results as ISearchResults,
        users: state.user.users,
        comments: state.discussion.comments,
        discussions: state.discussion.discussions,
    }
}

const mapDispatchToProps = {
    search,
    fetchUserData,
    getDiscussions,
    getComments,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SearchPage))
