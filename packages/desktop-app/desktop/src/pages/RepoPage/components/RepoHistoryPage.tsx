import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import BackupIcon from '@material-ui/icons/Backup'
import FolderIcon from '@material-ui/icons/Folder'
import Typography from '@material-ui/core/Typography'
import Timeline from 'conscience-components/Timeline'
// import CreateDiscussion from 'conscience-components/CreateDiscussion'
import CommitView from 'conscience-components/CommitView'
// import { H5 } from 'conscience-components/Typography/Headers'
import { getDiff } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { getURIFromParams } from 'conscience-components/env-specific'
import { ITimelineEvent, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoHistoryPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        const { commit } = this.props.match.params
        if (!this.props.uri) return null

        if (commit === undefined) {
            if (Object.keys(this.props.commits).length === 0) {
                return (
                        <Typography className={classes.emptyRepoMessage}>
                            This is the project history view.  Right now, it's empty.<br /><br />
                            Add some files and then commit them using the <BackupIcon /> button above.<br />
                            You can also open this folder on your computer by using the <FolderIcon /> button.
                        </Typography>
                )
            }

            return (
                <div className={classes.timelineWrapper}>
                    <Timeline uri={this.props.uri} />
                </div>
            )
        } else {
            return (
                <div>
                    <CommitView uri={{ ...this.props.uri, commit }} />

                    {/*<div className={classes.createDiscussionContainer}>
                        <H5>Start a discussion on this commit:</H5>
                        <div className={classes.createDiscussion}>
                            <CreateDiscussion uri={this.props.uri} attachedTo={commit} />
                        </div>
                    </div>*/}
                </div>
            )
        }
    }
}

interface MatchParams {
    commit: string | undefined
    repoHash: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri?: URI
    getDiff: typeof getDiff
    classes: any
    commits: { [commitHash: string]: ITimelineEvent }
}

const styles = (theme: Theme) => createStyles({
    timelineWrapper: {
        marginTop: 10,
    },
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    createDiscussionContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 32,
    },
    createDiscussion: {
        maxWidth: 700
    },
    emptyRepoMessage: {
        fontSize: '1.1rem',
        color: '#9c9c9c',
        maxWidth: 640,
        margin: '0 auto',
        background: '#f1f1f1',
        padding: 20,
        borderRadius: 10,
        border: '3px solid #9c9c9c',
        marginTop: 30,
        textAlign: 'center',
        lineHeight: '2rem',

        '& svg': {
            verticalAlign: 'text-bottom',
            margin: '0 5px',
        },
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const uri = getURIFromParams(ownProps.match.params)
    return {
        uri,
        commits: state.repo.commits,
    }
}

const mapDispatchToProps = {
    getDiff,
}

const RepoHistoryPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHistoryPage))

export default RepoHistoryPageContainer
