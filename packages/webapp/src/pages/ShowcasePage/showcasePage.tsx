import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { RouteComponentProps, Switch, Route } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import Fab from '@material-ui/core/Fab'
import Tooltip from '@material-ui/core/Tooltip'
import PeopleIcon from '@material-ui/icons/People'
import DescriptionIcon from '@material-ui/icons/Description'
import AssessmentIcon from '@material-ui/icons/Assessment'
import EditIcon from '@material-ui/icons/Edit'
import { Parallax } from 'react-parallax'
import UploadBannerDialog from './components/UploadBannerDialog'
import UploadPictureDialog from './components/UploadPictureDialog'
import ShowcaseTimeline from './components/ShowcaseTimeline'
import FeatResearchAndBlogs from './components/FeatResearchAndBlogs'
import BlogPage from './components/BlogPage'
import { fetchOrgInfo, uploadOrgBanner, uploadOrgPicture, changeOrgFeaturedRepos, updateOrgColors, fetchShowcaseTimeline } from 'conscience-components/redux/org/orgActions'
import { IGlobalState } from 'conscience-components/redux'
import { IOrganization, IFeaturedRepo } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import pluralize from 'pluralize'


@autobind
class ShowcasePage extends React.Component<Props, State>
{
    state = {
        dialogBannerOpen: false,
        dialogImgOpen: false,
        hover: false,
    }

    render() {
        const { org, classes } = this.props
        if (org === undefined) {
            return (
                <div className={classes.progressContainer}>
                    <CircularProgress color="secondary" />
                </div>
            )
        }
        const memberCount = org.members.length
        const activeRepoCount = org.repos.length
        const publicRepoCount = 0 // org.repos.filter(id => (repos[id] || {}).isPublic).length

        console.log('primary', this.props.org.primaryColor)
        console.log('secondary', this.props.org.secondaryColor)

        return (
            <div>
                <Parallax
                    className={classes.parallax}
                    bgImage={org.banner}

                    renderLayer={(percentage: any) => (
                        <div className={classes.titleContainer}>
                            <Tooltip title='Change Banner' placement='left'>
                                <Fab
                                    size="large"
                                    className={classes.changeBannerButton}
                                    onClick={this.openBannerDialog}
                                >
                                    <EditIcon />
                                </Fab>
                            </Tooltip>
                        </div>
                    )}
                />
                <UploadBannerDialog
                    open={this.state.dialogBannerOpen}
                    onSelectBanner={this.onSelectBanner}
                />
                <Grid xs={12} container >
                    <Grid item xs={false} sm={4} direction="column" className={classes.gridItem} style={{ backgroundColor: 'white' }}>

                        <div className={classes.introContainer}>
                            <div
                                className={classes.avatar}
                                style={{ backgroundImage: this.state.hover ? `url(https://i.ibb.co/mTdY0W9/showcase-Camera.png)` : `url(${org.picture['256x256']})` }}
                                onMouseEnter={this.handleMouseEnter}
                                onMouseOut={this.handleMouseOut}
                                onClick={this.dialogImgOpen}
                            ></div>
                        </div>
                        <UploadPictureDialog
                            open={this.state.dialogImgOpen}
                            onSelectImg={this.onSelectImg}
                        />

                        <div className={classes.statsContainer}>
                            <div className={classnames(classes.stats, classes.orgName)}>
                                <strong>{this.props.org ? this.props.org.name : 'No Organization Name'}</strong>
                            </div>
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
                        <Grid item className={classes.timelineContainer}>
                            <div className={classes.sectionHeader}>Live Updates</div>
                            <Divider className={classes.divider} />
                            <ShowcaseTimeline orgID={this.props.org.orgID} />
                        </Grid>
                    </Grid>
                    <Switch>
                        <Route path='/showcase/:orgID/blog/:blogID' component={BlogPage} />
                        <Route exact component={FeatResearchAndBlogs} />
                    </Switch>
                </Grid>
            </div>
        )
    }

    componentDidMount() {
        const orgID = this.props.match.params.orgID
        this.props.fetchOrgInfo({ orgID })
        this.props.updateOrgColors({ orgID: orgID, primaryColor: '#ff0000', secondaryColor: '#00ff00' })
        this.props.fetchShowcaseTimeline({ orgID })
    }

    componentDidUpdate(prevProps: Props) {
        const orgID = this.props.match.params.orgID
        if (orgID !== prevProps.match.params.orgID) {
            this.props.fetchOrgInfo({ orgID })
            this.props.updateOrgColors({ orgID: orgID, primaryColor: '#ff0000', secondaryColor: '#00ff00' })
            this.props.fetchShowcaseTimeline({ orgID })
        }
    }

    saveFeaturedRepos(featuredRepos: { [repoID: string]: IFeaturedRepo }) {
        const orgID = this.props.match.params.orgID
        this.props.changeOrgFeaturedRepos({ orgID, featuredRepos })
    }

    //---> Opens banner upload <---//
    openBannerDialog() {
        this.setState({ dialogBannerOpen: true })
    }

    onSelectBanner(fileInput: any) {
        if (fileInput !== null) {
            const orgID = this.props.match.params.orgID
            this.props.uploadOrgBanner({ orgID, fileInput })
        }
        this.setState({ dialogBannerOpen: false })
    }

    //---> Opens org picture upload <---//
    dialogImgOpen() {
        this.setState({ dialogImgOpen: true })
    }

    onSelectImg(fileInput: any) {
        if (fileInput !== null) {
            const orgID = this.props.match.params.orgID
            this.props.uploadOrgPicture({ orgID, fileInput })
        }
        this.setState({ dialogImgOpen: false })
    }

    handleMouseEnter = (event: any) => {
        console.log('enter')
        this.setState({ hover: true })

    }

    handleMouseOut = (event: any) => {
        console.log('exit')
        this.setState({ hover: false })
    }
}

interface MatchParams {
    orgID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    org: IOrganization
    fetchOrgInfo: typeof fetchOrgInfo
    uploadOrgBanner: typeof uploadOrgBanner
    uploadOrgPicture: typeof uploadOrgPicture
    changeOrgFeaturedRepos: typeof changeOrgFeaturedRepos
    updateOrgColors: typeof updateOrgColors
    fetchShowcaseTimeline: typeof fetchShowcaseTimeline
    classes: any
}

interface State {
    dialogBannerOpen: boolean
    dialogImgOpen: boolean
    hover: boolean
}

const styles = (theme: Theme) => createStyles({
    parallax: {
        height: 300,
    },
    introContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '-170px',
        position: 'relative',
    },
    avatar: {
        height: 200,
        width: 200,
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
        backgroundSize: 'cover',
        borderRadius: '100%',
        backgroundColor: 'white',
    },
    hoveredAvatar: {
        backgroundColor: 'white',
        height: 200,
        width: 200,
        borderRadius: '100%',
    },
    gridItem: {
        padding: '60px',
    },
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
    sectionHeader: {
        margin: '40px 0 0',
        fontSize: '2em',
        fontWeight: 'bold',
    },
    divider: {
        margin: '20px 0 30px'
    },
    statsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '40px 0'
    },
    stats: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1rem',
        margin: '5px 0',
        '& svg': {
            marginRight: 8,
        },
    },
    orgName: {
        fontSize: '2em',
        paddingBottom: 10,
        lineSpacing: '1em'
    },
    timelineContainer: {
        height: '100%',
        overflow: 'hidden',
    },
    uploadImg: {
        borderRadius: '100%',
        backgroundColor: 'red'
    }
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const orgID = props.match.params.orgID
    return {
        org: state.org.orgs[orgID],
    }
}

const mapDispatchToProps = {
    fetchOrgInfo,
    uploadOrgBanner,
    uploadOrgPicture,
    changeOrgFeaturedRepos,
    updateOrgColors,
    fetchShowcaseTimeline,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ShowcasePage))