import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import LargeAddButton from 'conscience-components/LargeAddButton'
// import RenderMarkdown from 'conscience-components/RenderMarkdown/RenderMarkdown'
import ReactMarkdown from 'react-markdown'
import RepositoryCards from 'conscience-components/RepositoryCards'
import { H6 } from 'conscience-components/Typography/Headers'
import Members from './connected/Members'
import { fetchOrgInfo, addRepoToOrg, addMemberToOrg, removeMemberFromOrg } from 'conscience-components/redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization, IRepo, IDiscussion, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgHomePage extends React.Component<Props>
{
    render() {
        const { org, classes } = this.props
        if (org === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }
        const hasReadme = org.readme && org.readme.length > 0

        return (
            <div className={classes.page}>
                <div className={classes.main}>
                    {!hasReadme &&
                        <LargeAddButton text="Click to add a welcome message for your team" onClick={this.onClickEditReadme} />
                    }
                    {hasReadme &&
                        <Card className={classes.readmeCard}>
                            <IconButton
                                onClick={this.onClickEditReadme}
                                className={classes.editButton}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <CardContent className={classes.readmeWrapper}>
                                <ReactMarkdown source={org.readme} />
                            </CardContent>
                        </Card>
                    }

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
                        userList={org.members}
                        adminList={[org.creator]}
                        addMember={this.addMember}
                        removeMember={this.removeMember}
                        selectUser={this.selectUser}
                        history={this.props.history}
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

    componentDidMount() {
        const orgID = this.props.match.params.orgID
        this.props.fetchOrgInfo({ orgID })
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

    addMember(payload: { email: string }) {
        const email = payload.email
        const orgID = this.props.match.params.orgID
        this.props.addMemberToOrg({ email, orgID })
    }

    removeMember(payload: { userID: string }) {
        const userID = payload.userID
        const orgID = this.props.match.params.orgID
        this.props.removeMemberFromOrg({ userID, orgID })
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
    addMemberToOrg: typeof addMemberToOrg
    removeMemberFromOrg: typeof removeMemberFromOrg
    classes: any
}

const styles = (theme: Theme) => createStyles({
    readmeWrapper: {
        padding: '24px 44px 44px',

        '& code': {
            backgroundColor: '#f5f5f5',
            color: '#d00707',
            padding: '2px 3px',
            borderRadius: 2,
            fontFamily: 'Consolas, Menlo, Monaco, "Courier New", Courier, monospace',
            fontSize: '0.8rem',
        },
        '& pre code': {
            color: 'inherit',
            backgroundColor: 'inherit',
            padding: 'inherit',
            borderRadius: 'unset',
        },
        '& img': {
            display: 'block',
            margin: '30px auto',
        },
    },
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    page: {
        display: 'flex',
        flexDirection: 'row',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    readmeCard: {
        marginBottom: 32,
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        top: 0,
        right: 0,
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
    showcaseCard: {
        marginTop: 32,
        '& button': {
            width: '100%',
            textTransform: 'none',
        },
    },
    showcaseIcon: {
        marginLeft: 8,
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
    addMemberToOrg,
    removeMemberFromOrg,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgHomePage))
