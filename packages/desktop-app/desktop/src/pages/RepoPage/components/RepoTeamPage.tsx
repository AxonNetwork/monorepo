import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import AccessControlList from 'conscience-components/AccessControlList'
import { updateUserPermissions } from 'conscience-components/redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { getURIFromParams } from 'conscience-components/env-specific'
import { URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoTeamPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        if (!this.props.uri) return null

        return (
            <div className={classes.page}>
                <AccessControlList uri={this.props.uri} />
            </div>
        )
    }
}

interface MatchParams {
    repoHash: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri?: URI
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
    const uri = getURIFromParams(ownProps.match.params)
    return {
        uri
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
