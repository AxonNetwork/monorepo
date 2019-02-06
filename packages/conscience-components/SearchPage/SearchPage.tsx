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
import Divider from '@material-ui/core/Divider'
import { search } from 'conscience-components/redux/search/searchActions'
import { H5, H6 } from 'conscience-components/Typography/Headers'
import { IGlobalState } from 'conscience-components/redux'
import { getFileURL, getDiscussionURL } from 'conscience-components/navigation'
import { ISearchResults, URIType, FileMode } from 'conscience-lib/common'


class SearchPage extends React.Component<Props>
{
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

                    <Card className={classes.card}>
                        <CardContent>
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

                            <Divider />

                            <H6>Comments</H6>
                            <List>
                                {results.comments.map(comment => (
                                    <ListItem>
                                        <Link to={getDiscussionURL({ type: URIType.Network, repoID: comment.repoID }, comment.discussionID)}>
                                            <div>{comment.repoID}</div>
                                            <div>{comment.commentID}</div>
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
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
    }
}

type Props = OwnProps & DispatchProps & RouteComponentProps<MatchParams> & { classes: any }

interface OwnProps {
    results: ISearchResults | null
}

interface DispatchProps {
    search: typeof search
}

interface MatchParams {
    query: string
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
    card: {
        width: '100%',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
    return {
        results: state.search.results,
    }
}

const mapDispatchToProps = {
    search,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SearchPage))
