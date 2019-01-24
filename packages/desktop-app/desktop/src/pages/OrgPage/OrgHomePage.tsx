import keyBy from 'lodash/keyBy'
import uniqBy from 'lodash/uniqBy'
import values from 'lodash/values'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import RepositoryCards from 'conscience-components/RepositoryCards'
import OrgReadme from 'conscience-components/OrgPage/OrgReadme'
import Members from 'conscience-components/OrgPage/ConnectedMembers'
import { H6 } from 'conscience-components/Typography/Headers'
import { fetchOrgInfo, addRepoToOrg } from 'conscience-components/redux/org/orgActions'
import { fetchFullRepo } from 'redux/repo/repoActions'
import { IGlobalState } from 'conscience-components/redux'
import { IOrganization, IRepo, IDiscussion, RepoPage } from 'conscience-lib/common'
import { autobind, getHash } from 'conscience-lib/utils'


@autobind
class OrgHomePage extends React.Component<Props>
{
    constructor(props: Props) {
        super(props)
        if (props.org && props.org.repos) {
            this.getRepos(props.org.repos)
        }
    }

    render() {
        const { org, classes } = this.props
        if (org === undefined) {
            return <LargeProgressSpinner />
        }
        const repos = uniqBy(values(this.props.repos), (repo: IRepo) => repo.repoID)
            .filter((repo: IRepo) => org.repos.indexOf(repo.repoID) > -1)
        const reposByID = keyBy(repos, 'repoID')
        const repoList = this.props.org.repos.filter(id => reposByID[id] !== undefined)

        return (
            <div className={classes.page}>
                <div className={classes.main}>
                    <OrgReadme
                        readme={org.readme}
                        onClickEditReadme={this.onClickEditReadme}
                    />
                    <H6 className={classes.repoHeader}>Repositories</H6>
                    <RepositoryCards
                        repoList={repoList}
                        repos={reposByID}
                        discussions={this.props.discussions}
                        discussionsByRepo={this.props.discussionsByRepo}
                        addRepo={this.addRepo}
                        selectRepoAndPage={this.selectRepoAndPage}
                    />
                </div>
                <div className={classes.sidebar}>
                    <Members
                        orgID={org.orgID}
                        selectUser={this.selectUser}
                    />
                </div>
            </div>
        )
    }

    getRepos(repoIDs: string[]) {
        const repos = this.props.repos
        for (let i = 0; i < repoIDs.length; i++) {
            const repoID = repoIDs[i]
            const path = Object.keys(repos).find(path => (repos[path].repoID === repoID))
            if (path !== undefined) {
                this.props.fetchFullRepo({ repoID, path })
            }
        }
    }

    componentDidUpdate(prevProps: Props) {
        const org = this.props.org
        if (!org || !org.repos) {
            return
        }
        if ((prevProps.org || {}).repos !== org.repos) {
            this.getRepos(org.repos)
        }
    }

    onClickEditReadme() {
        const orgID = this.props.match.params.orgID
        this.props.history.push(`/org/${orgID}/editor`)
    }

    addRepo(payload: { repoID: string }) {
        const repoID = payload.repoID
        const orgID = this.props.match.params.orgID
        this.props.addRepoToOrg({ repoID, orgID })
    }

    selectRepoAndPage(payload: { repoID?: string, repoRoot?: string | undefined, repoPage: RepoPage }) {
        if (payload.repoRoot === undefined) {
            return
        }
        const repoHash = getHash(payload.repoRoot)
        switch (payload.repoPage) {
            case RepoPage.Home:
                this.props.history.push(`/repo/${repoHash}`)
                return
            case RepoPage.Files:
                this.props.history.push(`/repo/${repoHash}/files`)
                return
            case RepoPage.Discussion:
                this.props.history.push(`/repo/${repoHash}/discussion`)
                return
        }
    }

    selectUser(payload: { username: string }) {
        const username = payload.username
        if (username === undefined) {
            return
        }
        this.props.history.push(`/user/${username}`)
    }
}

interface MatchParams {
    orgID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    org: IOrganization
    repos: { [repoRoot: string]: IRepo }
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] }
    fetchOrgInfo: typeof fetchOrgInfo
    addRepoToOrg: typeof addRepoToOrg
    fetchFullRepo: typeof fetchFullRepo
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
        repos: state.repo.repos,
        discussions: state.discussion.discussions,
        discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

const mapDispatchToProps = {
    fetchOrgInfo,
    addRepoToOrg,
    fetchFullRepo,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgHomePage))
