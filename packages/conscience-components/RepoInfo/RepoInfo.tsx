import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import PushPullButtons from 'conscience-components/PushPullButtons'
import Tabs from 'conscience-components/Tabs'
import { H5 } from 'conscience-components/Typography/Headers'
import { IGlobalState } from '../redux'
import { selectRepo } from '../navigation'
import { getRepoID } from '../env-specific'
import { RepoPage, URI, LocalURI, URIType } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'


@autobind
class RepoInfo extends React.Component<Props>
{
    render() {
        const { uri, showButtons, classes } = this.props

        return (
            <div className={classes.repoInfo}>
                <div className={classes.titleContainer}>
                    <H5 className={classes.headline}>{getRepoID(uri)}</H5>
                    {showButtons && uri.type === URIType.Local &&
                        <PushPullButtons
                            uri={uri as LocalURI}
                            classes={{ root: classes.pushPullButtons }}
                        />
                    }
                </div>

                <div className={classes.spacer}></div>

                <Tabs
                    pages={[
                        [RepoPage.Home, 'Home'],
                        [RepoPage.Files, 'Files'],
                        [RepoPage.History, 'History'],
                        [RepoPage.Discussion, 'Discussion'],
                        [RepoPage.Team, 'Team'],
                    ]}
                    activePage={this.props.repoPage}
                    onTabSelect={this.navigateRepoPage}
                    menuLabelsHidden={this.props.menuLabelsHidden}
                />
            </div>
        )
    }

    navigateRepoPage(repoPage: RepoPage) {
        selectRepo(this.props.uri, repoPage)
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI
    showButtons?: boolean
    repoPage: RepoPage
}

interface StateProps {
    menuLabelsHidden: boolean
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
    caption: {
        fontSize: '10pt',
    },
    titleContainer: {
        paddingBottom: 8,
        display: 'flex',
        flexWrap: 'wrap',
    },
    pushPullButtons: {
        marginLeft: 30,
    },
    cloneButton: {
        marginLeft: 64,
    },
    spacer: {
        flexGrow: 1,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const uriStr = uriToString(ownProps.uri)
    const menuLabelsHidden = state.user.userSettings.menuLabelsHidden || false
    return {
        menuLabelsHidden,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoInfo))