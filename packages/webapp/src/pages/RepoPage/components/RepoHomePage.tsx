import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import SecuredText from './connected/SecuredText'
import FileViewer from './connected/FileViewer'
import Timeline from './connected/Timeline'
import DiscussionList from './connected/DiscussionList'
import UserAvatar from 'conscience-components/UserAvatar'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoHomePage extends React.Component<Props>
{

	render() {
		const { repo, sharedUsers, classes } = this.props

		const readmeExists = (repo.files || {})['README.md']

		return (
			<main className={classes.main}>
                <div className={classnames(classes.readmeContainer, { [classes.readmeContainerNoReadme]: !readmeExists })}>
					{readmeExists &&
                        <React.Fragment>
							<FileViewer repoID={repo.repoID} filename={'README.md'}/>
                            <IconButton
                                onClick={this.onClickEditReadme}
                                className={classes.editReadmeButton}
                            >
                                <EditIcon />
                            </IconButton>
                        </React.Fragment>
					}
					{!readmeExists &&
	                    <div className={classes.readmeContainerNoReadmeContents} onClick={this.onClickEditReadme}>
	                        <Typography className={classes.noReadmeText}>
	                            Click to add a welcome message and instructions to this repository.
	                        </Typography>

	                        <AddCircleOutlineIcon className={classes.noReadmeAddIcon} />
	                    </div>
					}
				</div>
				<div className={classes.sidebarComponents}>
					{(repo.commitList || []).length > 0 &&
						<Card className={classes.card}>
							<CardContent classes={{ root: classes.securedTextCard}} >
								<SecuredText
									repoID={repo.repoID}
									history={this.props.history}
								/>
							</CardContent>
						</Card>
					}
					<Card className={classes.card}>
						<CardContent>
							<Typography variant="h6">
								Team
							</Typography>
							<div className={classes.sharedUsersRow}>
							{sharedUsers.map((user: IUser | undefined) => {
								if(user !== undefined){
									return <UserAvatar username={user.name} userPicture={user.picture} />
								}else {
									return null
								}
							})}
							</div>
						</CardContent>
					</Card>
					<Card className={classes.card}>
						<CardContent>
							<Typography variant="h6">
								Recent Discussions
							</Typography>
							<DiscussionList
								repoID={repo.repoID}
								history={this.props.history}
								maxLength={2}
							/>
						</CardContent>
					</Card>
					<Card className={classes.card}>
						<CardContent>
							<Typography variant="h6">
								Recent Commits
							</Typography>
							<Timeline
								repoID={repo.repoID}
								history={this.props.history}
								defaultRowsPerPage={2}
								hidePagination
							/>
						</CardContent>
					</Card>
				</div>
			</main>
		)
	}

	onClickEditReadme() {
		const repoID = this.props.match.params.repoID
		this.props.history.push(`/repo/${repoID}/edit/README.md`)
	}
}

interface MatchParams {
	repoID: string
}

interface Props extends RouteComponentProps<MatchParams>{
	repo: IRepo
	sharedUsers: IUser[]
	classes: any
}

const styles = (theme: Theme) => createStyles({
	main: {
		display: 'flex',
		marginTop: 32,
	},
	readmeContainer: {
		position: 'relative',
		flexGrow: 3,
		marginRight: 16,
		maxHeight: 500,
	},
    editReadmeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    readmeContainerNoReadme: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        border: '3px solid #c5c5c5',
        padding: 30,
        textAlign: 'center',
        cursor: 'pointer',
        flexBasis: 320,
    },
    readmeContainerNoReadmeContents: {
        position: 'relative',
        top: '15%',
    },
    noReadmeText: {
        fontSize: '1.2rem',
        color: '#a2a2a2',
        fontWeight: 700,
        marginBottom: 20,
    },
    noReadmeAddIcon: {
        fontSize: '5rem',
        color: '#a2a2a2',
    },
	sidebarComponents: {
		flexGrow: 1,
		marginLeft: 16,
	},
	card: {
		marginBottom: 16
	},
	securedTextCard: {
		padding: 16
	},
	sharedUsersRow: {
		display: 'flex',
		flexDirection: 'row',
		'& div': {
			marginRight: 4
		}
	},
})

const mapStateToProps = (state: IGlobalState, ownProps: RouteComponentProps<MatchParams>) => {
	const repoID = ownProps.match.params.repoID
	const repo = state.repo.repos[repoID]
	const sharedUsers = (repo.sharedUsers || []).map(id => state.user.users[id])
    return {
    	repo,
    	sharedUsers,
    }
}

const mapDispatchToProps = {}

const RepoHomePageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoHomePage))

export default RepoHomePageContainer
