import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import SharedUsers from 'conscience-components/SharedUsers'
import { updateUserPermissions } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoTeamPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props

        return (
            <div className={classes.page}>
                <SharedUsers uri={this.props.uri} />
            </div>
        )
    }
}

interface MatchParams {
    repoHash: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri: URI
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const repoHash = props.match.params.repoHash
    const repoRoot = state.repo.reposByHash[repoHash]
    return {
        uri: { type: URIType.Local, repoRoot } as URI
    }
}

const mapDispatchToProps = {
    updateUserPermissions,
}

const RepoTeamPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoTeamPage))

export default RepoTeamPageContainer
