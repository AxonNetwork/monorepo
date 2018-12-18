import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import SharedUsers from 'conscience-components/SharedUsers'
import { IGlobalState } from 'redux/store'
import { IRepo, IUser } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoFilesPage extends React.Component<Props>
{

	render() {
		const { classes } = this.props

		return (
			<div className={classes.page}>
				<SharedUsers
					repo={this.props.repo}
					users={this.props.users}
					addCollaborator={this.addCollaborator}
					removeCollaborator={this.removeCollaborator}
					classes={{root: classes.sharedUsers}}
				/>
			</div>
		)
	}

    addCollaborator(payload: { repoID: string, repoRoot?: string,  email: string }) {
    	console.log("add collab :", payload)
    }

    removeCollaborator(payload: { repoID: string, repoRoot?: string,  userID: string }) {
    	console.log("remove collab :", payload)
    }
}

interface MatchParams {
	repoID: string
}

interface Props extends RouteComponentProps<MatchParams>{
    repo: IRepo | undefined
    users: {[userID: string]: IUser}
    addCollaborator: (payload: { repoID: string, repoRoot?: string,  email: string }) => void
    removeCollaborator: (payload: { repoID: string, repoRoot?: string,  userID: string }) => void
	classes: any
}

const styles = (theme: Theme) => createStyles({
	page: {
		marginTop: 32
	},
	sharedUsers: {
		maxWidth: 500
	}
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
	const repoID = props.match.params.repoID
    return {
    	repo: state.repo.repos[repoID],
    	users: state.user.users
    }
}

const mapDispatchToProps = {}

const RepoFilesPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoFilesPage))

export default RepoFilesPageContainer
