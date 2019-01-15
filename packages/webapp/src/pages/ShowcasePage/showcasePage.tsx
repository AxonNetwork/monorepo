import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import PeopleIcon from '@material-ui/icons/People'
import DescriptionIcon from '@material-ui/icons/Description'
import AssessmentIcon from '@material-ui/icons/Assessment'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { Parallax } from 'react-parallax'
import UserAvatar from 'conscience-components/UserAvatar'
import { H5 } from 'conscience-components/Typography/Headers'
import Container from './components/Container'
import FeaturedRepos from './components/FeaturedRepos'
import UploadBannerDialog from './components/UploadBannerDialog'
import ShowcaseTimeline from './components/ShowcaseTimeline'
import OrgBlog from './components/connected/OrgBlog'
import { getRepoList } from 'redux/repo/repoActions'
import { fetchOrgInfo, uploadOrgBanner, changeOrgFeaturedRepos } from 'redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization, IRepo, IUser, IDiscussion, IFeaturedRepo } from 'conscience-lib/common'
import { autobind, nonCacheImg } from 'conscience-lib/utils'
import pluralize from 'pluralize'


@autobind
class ShowcasePage extends React.Component<Props, State>
{
    state = {
        dialogOpen: false,
        showAllMembers: false,
    }

    render() {
        const { org, users, repos, classes } = this.props
        if (org === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }
        const memberCount = org.members.length
        const activeRepoCount = org.repos.length
        const publicRepoCount = org.repos.filter(id => (repos[id] || {}).isPublic).length

        let membersToShow = org.members
        if (!this.state.showAllMembers) {
            membersToShow = org.members.slice(0, 6)
        }

        return (
            <div>
                <Parallax
                    bgImage={nonCacheImg(org.banner)}
                    strength={500}
                    renderLayer={(percentage: any) => (
                        <div className={classes.titleContainer}>
                            <Button
                                variant="contained"
                                className={classes.changeBannerButton}
                                onClick={this.openBannerDialog}
                            >
                                Change Banner
                            </Button>
                            <div
                                className={classes.title}
                                style={{
                                    bottom: (1 - percentage) * 700,
                                }}
                            >
                                <Typography variant="h2"
                                    style={{
                                        color: `rgba(0, 0, 0, ${1.5 - percentage})`,
                                        backgroundColor: `rgba(255, 255, 255, ${1.5 - percentage})`,
                                        boxShadow: `0 0 5px 5px rgba(255, 255, 255, ${1.5 - percentage})`,
                                    }}
                                >
                                    {org.name}
                                </Typography>
                            </div>
                        </div>
                    )}
                />
                <UploadBannerDialog
                    open={this.state.dialogOpen}
                    onSelectBanner={this.onSelectBanner}
                />
                <Container>
                    <div className={classes.statsContainer}>
                        <div className={classes.stats}>
                            <PeopleIcon />
                            {memberCount} {pluralize('Researcher', memberCount)}
                        </div>
                        <div className={classes.stats}>
                            <DescriptionIcon />
                            {publicRepoCount} Published {pluralize('Study', publicRepoCount)}
                        </div>
                        <div className={classes.stats}>
                            <AssessmentIcon />
                            {activeRepoCount} Active {pluralize('Repository', activeRepoCount)}
                        </div>
                    </div>
                    <Grid container spacing={40} >
                        <Grid item xs={12} sm={8}>
                            <FeaturedRepos
                                featuredRepos={org.featuredRepos}
                                repos={repos}
                                orgRepoList={org.repos}
                                canEdit
                                onSave={this.saveFeaturedRepos}
                                selectRepo={this.selectRepo}
                            />

                            <div>
                                <OrgBlog orgID={this.props.match.params.orgID} />
                            </div>
                        </Grid>

                        <Grid item xs={false} sm={4} className={classes.timelineContainer}>
                            <H5>Live Updates</H5>
                            <div><em>From researchers who are doing their work in the open</em></div>

                            <Divider />

                            <ShowcaseTimeline
                                org={this.props.org}
                                repos={this.props.repos}
                                users={this.props.users}
                                usersByEmail={this.props.usersByEmail}
                                selectCommit={this.selectCommit}
                            />
                        </Grid>
                    </Grid>

                    <H5 className={classes.teamHeader}>Meet Our Researchers</H5>
                    <div className={classes.team}>
                        {membersToShow.map(id => {
                            const user = users[id] || {}
                            return (
                                <div className={classes.teamAvatarWrapper}>
                                    <UserAvatar
                                        user={user}
                                        selectUser={this.selectUser}
                                        classes={{ root: classes.teamAvatar }}
                                    />
                                    <div>{user.name}</div>
                                </div>
                            )
                        })}
                    </div>

                    {memberCount > 6 && !!this.state.showAllMembers &&
                        <div className={classes.teamSeeMore}>
                            <Button
                                color="secondary"
                                onClick={this.showAllMembers}
                            >
                                See All Researchers
                                <ArrowForwardIcon />
                            </Button>
                        </div>
                    }
                </Container>
            </div>
        )
    }

    componentDidMount() {
        const orgID = this.props.match.params.orgID
        this.props.fetchOrgInfo({ orgID })
        this.props.getRepoList({})
    }

    saveFeaturedRepos(featuredRepos: { [repoID: string]: IFeaturedRepo }) {
        const orgID = this.props.match.params.orgID
        this.props.changeOrgFeaturedRepos({ orgID, featuredRepos })
    }

    selectRepo(payload: { repoID: string }) {
        const repoID = payload.repoID
        if (repoID !== undefined) {
            this.props.history.push(`/repo/${repoID}`)
        }
    }

    selectCommit(commit: string, repoID: string | undefined) {
        if (repoID === undefined) {
            return
        }
        this.props.history.push(`/repo/${repoID}/history/${commit}`)
    }

    openBannerDialog() {
        this.setState({ dialogOpen: true })
    }

    onSelectBanner(fileInput: any) {
        if (fileInput !== null) {
            const orgID = this.props.match.params.orgID
            this.props.uploadOrgBanner({ orgID, fileInput })
        }
        this.setState({ dialogOpen: false })
    }

    showAllMembers() {
        this.setState({ showAllMembers: true })
    }

    selectUser(payload: { username: string | undefined }) {
        console.log(payload)
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
    repos: { [repoID: string]: IRepo }
    users: { [userID: string]: IUser }
    usersByEmail: { [email: string]: string }
    discussions: { [discussionID: string]: IDiscussion }
    discussionsByRepo: { [repoID: string]: string[] }
    getRepoList: typeof getRepoList
    fetchOrgInfo: typeof fetchOrgInfo
    uploadOrgBanner: typeof uploadOrgBanner
    changeOrgFeaturedRepos: typeof changeOrgFeaturedRepos
    classes: any
}

interface State {
    dialogOpen: boolean
    showAllMembers: boolean
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    headerImg: {
        width: '100%',
        maxHeight: 400,
        overflow: 'hidden',
        position: 'relative',
        '& img': {
            width: '100%',
        },
    },
    titleContainer: {
        position: 'relative',
        height: 500,
    },
    title: {
        position: 'absolute',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        '& h2': {
            padding: 8,
            borderRadius: 5,
        },
    },
    changeBannerButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        textTransform: 'none',
    },
    statsContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    stats: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        marginBottom: 32,
        '& svg': {
            marginRight: 8,
        },
    },
    timelineContainer: {
        height: '100%',
        overflow: 'hidden',
    },
    teamHeader: {
        textAlign: 'center',
        marginTop: 64,
    },
    team: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    teamAvatarWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 16,
        '& p': {
            fontSize: '1.1rem',
            marginTop: 8,
        },
    },
    teamAvatar: {
        width: 150,
        height: 150,
        fontSize: '2rem',
    },
    teamSeeMore: {
        width: '100%',
        textAlign: 'center',
        marginTop: 16,
        '& button': {
            textTransform: 'none',
            '& svg': {
                marginLeft: 8,
            },
        },
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const orgID = props.match.params.orgID
    return {
        org: state.org.orgs[orgID],
        repos: state.repo.repos,
        users: state.user.users,
        usersByEmail: state.user.usersByEmail,
        discussions: state.discussion.discussions,
        discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

const mapDispatchToProps = {
    fetchOrgInfo,
    getRepoList,
    uploadOrgBanner,
    changeOrgFeaturedRepos,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ShowcasePage))
