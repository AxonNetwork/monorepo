import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Tabs from 'conscience-components/Tabs'
import { IRepo, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoInfo extends React.Component<Props>
{

    render() {
        const { repo, classes } = this.props
        if (repo === undefined) {
            return null
        }
        const version = (repo.commitList !== undefined) ? 'v' + repo.commitList.length : ''
        return (
            <div className={classes.repoInfo}>
                <div className={classes.titleContainer}>
                    <Typography variant="headline" className={classes.headline}>{repo.repoID}</Typography>
                    <Typography className={classes.version}>{version}</Typography>
                </div>

                <div className={classes.spacer}></div>
`
                <Tabs
                    pages={[
                        [RepoPage.Home, 'Home'],
                        [RepoPage.Files, 'Files'],
                        [RepoPage.History, 'History'],
                        [RepoPage.Discussion, 'Discussion'],
                        [RepoPage.Settings, 'Settings'],

                    ]}
                    activePage={this.props.repoPage}
                    onTabSelect={this.props.navigateRepoPage}
                    menuLabelsHidden={this.props.menuLabelsHidden}
                />
            </div >
        )
    }
}

interface Props {
    repo: IRepo | undefined
    repoPage: RepoPage
    menuLabelsHidden: boolean
    navigateRepoPage: (repoPage: RepoPage) => void

    classes: any
}

const styles = (theme: Theme) => createStyles({
    repoInfo: {
        borderBottom: '1px solid #e4e4e4',
        display: 'flex',
        justifyContent: 'space-between',
        flexShrink: 0,
    },
    locationLink: {
        color: theme.palette.secondary.main,
        cursor: 'pointer',
    },
    headline: {
        marginRight: '8px',
        display: 'block',
        fontSize: '2rem',
        color: 'rgba(0, 0, 0, 0.7)',
    },
    version: {
        // display: 'inline-block',
    },
    caption: {
        fontSize: '10pt',
    },
    titleContainer: {
        paddingBottom: 20,
        display: 'flex',
        flexWrap: 'wrap',
    },
    pushPullButtons: {
        marginLeft: 30,
    },
    spacer: {
        flexGrow: 1,
    },
})

export default withStyles(styles)(RepoInfo)