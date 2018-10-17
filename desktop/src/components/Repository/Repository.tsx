import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

import RepoInfo from './elements/RepoInfo'
import RepoFilesPage from './elements/RepoFilesPage'
import RepoHistoryPage from './elements/RepoHistoryPage'
import RepoEditorPage from './elements/RepoEditorPage'
import RepoDiscussionPage from './elements/RepoDiscussionPage'
import RepoSettingsPage from './elements/RepoSettingsPage'
import autobind from 'utils/autobind'
import { RepoPage } from 'redux/repository/repoReducer'
import { navigateRepoPage } from 'redux/repository/repoActions'
import { IGlobalState } from 'redux/store'


@autobind
class Repository extends React.Component<Props>
{
    render() {
        const classes = this.props.classes
        return (
            <div className={classes.repoWrapper}>
                <RepoInfo />

                <div className={classes.repoMainContent}>
                    <div className={classes.repoMainContentInner}>
                        {this.props.repoPage === RepoPage.Files &&
                            <RepoFilesPage />
                        }
                        {this.props.repoPage === RepoPage.Manuscript &&
                            <RepoEditorPage />
                        }
                        {this.props.repoPage === RepoPage.History &&
                            <RepoHistoryPage />
                        }
                        {this.props.repoPage === RepoPage.Discussion &&
                            <RepoDiscussionPage />
                        }
                        {this.props.repoPage === RepoPage.Settings &&
                            <RepoSettingsPage />
                        }
                    </div>
                </div>
            </div>
        )
    }

    onNavigateRepoPage(_: any, i: number) {
        this.props.navigateRepoPage({ repoPage: i as RepoPage })
    }
}

interface Props {
    sidebarOpen: boolean
    repoPage: RepoPage
    navigateRepoPage: typeof navigateRepoPage
    classes: any
}

const styles = (theme: Theme) => createStyles({
    repoWrapper: {
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        flexGrow: 1,
    },
    repoMainContent: {
        overflowY: 'auto',
        display: 'flex',
        flexGrow: 1,

        '& > *': {
            flexGrow: 1,
        },
    },
    repoMainContentInner: {
        marginTop: theme.spacing.unit * 4,
        marginRight: theme.spacing.unit * 4,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        repoPage: state.repository.repoPage,
    }
}

const mapDispatchToProps = {
    navigateRepoPage,
}

const RepositoryContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Repository))

export default withStyles(styles)(RepositoryContainer)
