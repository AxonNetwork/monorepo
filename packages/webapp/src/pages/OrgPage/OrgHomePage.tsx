import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import OrgReadme from 'conscience-components/OrgPage/OrgReadme'
import Members from 'conscience-components/Members'
import RepositoryCards from 'conscience-components/RepositoryCards'
import { H6 } from 'conscience-components/Typography/Headers'
import { IGlobalState } from 'conscience-components/redux'
import { selectOrgShowcase, selectUser } from 'conscience-components/navigation'
import { IOrganization, URI, URIType } from 'conscience-lib/common'
import { getRepoList } from 'conscience-components/redux/repo/repoActions'
import { addRepoToOrg } from 'conscience-components/redux/org/orgActions'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgHomePage extends React.Component<Props>
{
    render() {
        const { org, repoList, classes } = this.props
        if (org === undefined) {
            return <LargeProgressSpinner />
        }
        const repoURIList = org.repos.map(repoID => ({ type: URIType.Network, repoID }) as URI)
        const reposToAdd = repoList.filter(repoID => org.repos.indexOf(repoID) < 0)

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
                    <Button
                        className={classes.seeShowcaseButton}
                        color="secondary"
                        variant="raised"
                        onClick={this.navigateShowcasePage}
                    >
                        See Showcase Page
                    </Button>
                </div>
            </div>
        )
    }

    componentDidMount() {
        if (this.props.currentUser) {
            this.props.getRepoList({ userID: this.props.currentUser })
        }
    }

    onClickEditReadme() {
        const orgID = this.props.match.params.orgID
        this.props.history.push(`/org/${orgID}/editor`)
    }

    addRepo(repoID: string | undefined) {
        const orgID = this.props.match.params.orgID
        if (repoID !== undefined) {
            this.props.addRepoToOrg({ repoID, orgID })
        }
    }

    selectUser(payload: { username: string }) {
        selectUser(payload.username)
    }

    navigateShowcasePage() {
        const { orgID } = this.props.match.params
        selectOrgShowcase(orgID)
    }
}

type Props = StateProps & DispatchProps & RouteComponentProps<MatchParams> & { classes: any }

interface MatchParams {
    orgID: string
}

interface StateProps {
    org: IOrganization
    repoList: string[]
    currentUser: string | undefined
}

interface DispatchProps {
    getRepoList: typeof getRepoList
    addRepoToOrg: typeof addRepoToOrg
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
    seeShowcaseButton: {
        alignSelf: 'flex-end',
        marginTop: 20,
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const orgID = props.match.params.orgID
    const currentUser = state.user.currentUser
    return {
        org: state.org.orgs[orgID],
        repoList: state.repo.repoListByUserID[currentUser || ''] || [],
        currentUser,
    }
}

const mapDispatchToProps = {
    getRepoList,
    addRepoToOrg,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgHomePage))
