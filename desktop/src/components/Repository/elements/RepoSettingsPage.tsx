import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { IGlobalState } from 'redux/store'
import Sharing from './RepoInfo/Sharing'
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
                />
            </div>
        )
    }
}

interface Props {
    classes: any
    repo: IRepo
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
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoSettingsPage))

