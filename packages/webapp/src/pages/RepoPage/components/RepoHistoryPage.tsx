import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Timeline from 'conscience-components/Timeline'
import CreateDiscussion from 'conscience-components/CreateDiscussion'
import CommitView from 'conscience-components/CommitView'
import { H5 } from 'conscience-components/Typography/Headers'
import { getDiff } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoHistoryPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        const { commit } = this.props.match.params

        if (commit === undefined) {
            return (
                <Timeline uri={this.props.uri} />
            )
        } else {
            return (
                <div className={classes.main}>
                    <CommitView uri={{ ...this.props.uri, commit }} />

                    <div className={classes.createDiscussionContainer}>
                        <H5>Start a discussion on this commit:</H5>
                        <div className={classes.createDiscussion}>
                            <CreateDiscussion uri={this.props.uri} attachedTo={commit} />
                        </div>
                    </div>
                </div>
            )
        }
    }
}

type Props = StateProps & RouteComponentProps<MatchParams> & { classes: any }

interface MatchParams {
    commit: string | undefined
    repoID: string
}

interface StateProps {
    uri: URI
    getDiff: typeof getDiff
}

const styles = (theme: Theme) => createStyles({
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
    }
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    const uri = { type: URIType.Network, repoID: props.match.params.repoID } as URI
    return {
        uri,
    }
}

const mapDispatchToProps = {
    getDiff,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHistoryPage))

