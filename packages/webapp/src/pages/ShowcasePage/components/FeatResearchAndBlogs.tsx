import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { ArrowForward as ArrowForwardIcon } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import UserAvatar from 'conscience-components/UserAvatar'
import FeaturedRepos from './FeaturedRepos'
import OrgBlog from './connected/OrgBlog'
import { getRepoList } from 'conscience-components/redux/repo/repoActions'
import { fetchOrgInfo } from 'conscience-components/redux/org/orgActions'
import { IGlobalState } from 'conscience-components/redux'
import { IOrganization, IRepo, IUser, IDiscussion, IFeaturedRepo } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import pluralize from 'pluralize'


@autobind
class FeatResearchAndBlogs extends React.Component<Props, State> 
{
    state = {
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

        let membersToShow = org.members
        if (!this.state.showAllMembers) {
            membersToShow = org.members.slice(0, 6)
        }
        
        return (
            <Grid item xs={false} sm={8} className={classes.gridItem}>
                <Grid item>
                    <FeaturedRepos
                        featuredRepos={org.featuredRepos}
                        orgRepoList={org.repos}
                        canEdit
                        onSave={this.saveFeaturedRepos}
                    />
                    <div>
                        <div className={classes.sectionHeader}>News and Updates</div>
                        <Divider className={classes.divider} />
                        <OrgBlog orgID={this.props.orgID} />
                    </div>

                    <div className={classes.sectionHeader} style={{ marginTop: 40 }}>Meet Our Researchers</div>
                    <Divider className={classes.divider} />
                    <div className={classes.team}>
                        {membersToShow.map((id:number) => {
                            const user = users[id] || {}
                            return (
                                <div className={classes.teamAvatarWrapper}>
                                    <UserAvatar user={user} classes={{ root: classes.teamAvatar }}/>
                                    <div>{user.name}</div>
                                </div>
                            )
                        })}
                    </div>

                    {memberCount > 6 && !!this.state.showAllMembers &&
                        <div className={classes.teamSeeMore}>
                            <Button color="secondary" onClick={this.showAllMembers}>
                                See All Researchers
                                <ArrowForwardIcon />
                            </Button>
                        </div>
                    }
                </Grid>
            </Grid>
        )
    }

    componentDidMount() {
        const orgID = this.props.orgID
        this.props.fetchOrgInfo({ orgID })
        this.props.getRepoList({})
    }

    saveFeaturedRepos(featuredRepos: { [repoID: string]: IFeaturedRepo }) {
        const orgID = this.props.orgID
        this.props.changeOrgFeaturedRepos({ orgID, featuredRepos })
    }

    showAllMembers() {
        this.setState({ showAllMembers: true })
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    orgID: string
}

interface StateProps {
    org: IOrganization
    users: { [userID: string]: IUser }
    repos: any
}

interface DispatchProps {
    getRepoList: typeof getRepoList
    fetchOrgInfo: typeof fetchOrgInfo
}

interface State { 
    showAllMembers: boolean
}

const styles = (theme: Theme) => createStyles({
    gridItem: {
        padding: '60px',
    },
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    },
    sectionHeader: {
        margin: '40px 0 0',
        fontSize: '2em',
        fontWeight: 'bold',
    },
    divider: {
        margin: '20px 0 30px'
    },
    teamHeader: {
        textAlign: 'center',
        marginTop: 16,
        fontWeight: 'bold',
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

const mapStateToProps = (state: IGlobalState, props: OwnProps) => {
    return {
        org: state.org.orgs[props.orgID],
        users: state.user.users,
        usersByEmail: state.user.usersByEmail,
        discussions: state.discussion.discussions,
        discussionsByRepo: state.discussion.discussionsByRepo,
    }
}

const mapDispatchToProps = {
    fetchOrgInfo,
    getRepoList,
    // uploadOrgBanner,
    // uploadOrgPicture,
    // changeOrgFeaturedRepos,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(FeatResearchAndBlogs))