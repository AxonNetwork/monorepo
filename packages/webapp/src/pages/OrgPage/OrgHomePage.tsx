import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import OrgReadme from 'conscience-components/OrgPage/OrgReadme'
import Members from 'conscience-components/OrgPage/ConnectedMembers'
import RepositoryCards from 'conscience-components/RepositoryCards'
import { H6 } from 'conscience-components/Typography/Headers'
import { fetchOrgInfo, addRepoToOrg } from 'conscience-components/redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization, IRepo, IDiscussion, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgHomePage extends React.Component<Props>
{
    render() {
        const { org, classes } = this.props
        if (org === undefined) {
            return <LargeProgressSpinner />
        }

        return (
            <div className={classes.page}>
                <div className={classes.main}>
                    <OrgReadme
                        readme={org.readme}
                        onClickEditReadme={this.onClickEditReadme}
                    />
                    <H6 className={classes.repoHeader}>Repositories</H6>
                    <RepositoryCards
                        repoList={this.props.org.repos}
                        repos={this.props.repos}
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
        const repoID = payload.repoID
        switch (payload.repoPage) {
            case RepoPage.Home:
                this.props.history.push(`/repo/${repoID}`)
                return
            case RepoPage.Files:
                this.props.history.push(`/repo/${repoID}/files`)
                return
            case RepoPage.Discussion:
                this.props.history.push(`/repo/${repoID}/discussion`)
                return
        }
    }

    selectUser(payload: { username: string }) {
        console.log(payload)
        const username = payload.username
        if (username === undefined) {
            return
        }
        this.props.history.push(`/user/${username}`)
    }

    navigateShowcasePage() {
        const orgID = this.props.match.params.orgID
        this.props.history.push(`/showcase/${orgID}`)
    }
}

interface MatchParams {
    orgID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    org: IOrganization
    repos: { [repoID: string]: IRepo }
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] }
    fetchOrgInfo: typeof fetchOrgInfo
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
    seeShowcaseButton: {
        alignSelf: 'flex-end',
        marginTop: 20,
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
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgHomePage))
