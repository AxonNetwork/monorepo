import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { IGlobalState } from 'redux/store'
import Sharing from './RepoInfo/Sharing'
import { addCollaborator, removeCollaborator } from '../../../redux/repository/repoActions'
import { IRepo } from 'common'


class RepoSettingsPage extends React.Component<Props>
{
    render() {
        const { classes, repo } = this.props
        return (
            <div className={classes.settingsPage}>
                <Sharing
                    sharedUsers={repo.sharedUsers || []}
                    folderPath={repo.path}
                    repoID={repo.repoID}
                    addCollaborator={this.props.addCollaborator}
                    removeCollaborator={this.props.removeCollaborator}
                />
            </div>
        )
    }
}

interface Props {
    classes: any
    repo: IRepo
    addCollaborator: typeof addCollaborator
    removeCollaborator: typeof removeCollaborator
}

const styles = (_: Theme) => createStyles({
    settingsPage: {
        display: 'flex',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const selected = state.repository.selectedRepo || ''
    const repo = state.repository.repos[selected] || {}
    return {
        repo,
    }
}

const mapDispatchToProps = {
    addCollaborator,
    removeCollaborator
}

const RepoSettingsPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoSettingsPage))

export default RepoSettingsPageContainer

