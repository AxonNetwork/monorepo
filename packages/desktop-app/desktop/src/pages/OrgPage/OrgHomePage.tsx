import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import RepositoryCards from 'conscience-components/RepositoryCards'
import OrgReadme from 'conscience-components/OrgPage/OrgReadme'
import Members from 'conscience-components/Members'
import { H6 } from 'conscience-components/Typography/Headers'
import { addRepoToOrg } from 'conscience-components/redux/org/orgActions'
import { IGlobalState } from 'conscience-components/redux'
import { selectUser, selectNewRepoPage } from 'conscience-components/navigation'
import { IOrganization, URI, LocalURI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgHomePage extends React.Component<Props>
{
    render() {
        const { org, localRepoList, repoIDsByPath, classes } = this.props
        if (org === undefined) {
            return <LargeProgressSpinner />
        }
        const repoURIList = org.repos.map(repoID => ({ type: URIType.Network, repoID }) as URI)
        const reposToAdd = localRepoList.map(uri => repoIDsByPath[uri.repoRoot || ''])
            .filter(repoID => repoID && org.repos.indexOf(repoID) < 0)

        return (
            <div className={classes.page}>
                <div className={classes.main}>
                    <OrgReadme
                        readme={org.readme}
                        onClickEditReadme={this.onClickEditReadme}
                    />
                    <H6 className={classes.repoHeader}>Repositories</H6>
                    <RepositoryCards
                        repoList={repoURIList}
                        reposToAdd={reposToAdd}
                        addRepo={this.addRepo}
                    />
                </div>
                <div className={classes.sidebar}>
                    <Members orgID={org.orgID} />
                </div>
            </div>
        )
    }

    onClickEditReadme() {
        const orgID = this.props.match.params.orgID
        this.props.history.push(`/org/${orgID}/editor`)
    }

    addRepo(repoID: string | undefined) {
        const orgID = this.props.match.params.orgID
        if (repoID !== undefined) {
            this.props.addRepoToOrg({ repoID, orgID })
        } else {
            selectNewRepoPage(orgID)
        }
    }

    selectUser(payload: { username: string }) {
        selectUser(payload.username)
    }
}

interface MatchParams {
    orgID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    org: IOrganization
    localRepoList: LocalURI[]
    repoIDsByPath: { [repoRoot: string]: string }
    addRepoToOrg: typeof addRepoToOrg
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        display: 'flex',
        flexDirection: 'row',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    repoHeader: {
        marginBottom: 16,
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 350,
        marginLeft: 32,
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const orgID = props.match.params.orgID
    return {
        org: state.org.orgs[orgID],
        localRepoList: state.repo.localRepoList,
        repoIDsByPath: state.repo.repoIDsByPath,
    }
}

const mapDispatchToProps = {
    addRepoToOrg,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgHomePage))
