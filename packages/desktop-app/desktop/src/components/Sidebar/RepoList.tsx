import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'
import { IGlobalState } from 'conscience-components/redux'
import { selectRepo } from 'conscience-components/navigation'
import { IRepoFile, LocalURI, RepoPage } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'


@autobind
class RepoList extends React.Component<Props>
{
    render() {
        const { localRepoList, repoIDsByPath, filesByURI, selectedRepo, classes } = this.props
        return (
            <List>
                {localRepoList.sort().map((uri: LocalURI) => {
                    const repoID = repoIDsByPath[uri.repoRoot]
                    let isChanged = false
                    const files = filesByURI[uriToString(uri)]
                    if (files !== undefined) {
                        isChanged = Object.keys(files).some(
                            (name) => files[name].status === 'M' || files[name].status === '?' || files[name].status === 'U',
                        )
                    }
                    const isSelected = uri.repoRoot === selectedRepo
                    return (
                        <React.Fragment key={uri.repoRoot}>
                            <ListItem
                                button
                                dense
                                className={classnames({ [classes.selected]: isSelected })}
                                onClick={() => selectRepo(uri, RepoPage.Home)}
                            >
                                {isChanged &&
                                    <Badge classes={{ badge: classes.badge }} badgeContent="" color="secondary">
                                        <ListItemText primary={repoID} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                                    </Badge>
                                }
                                {!isChanged &&
                                    <ListItemText primary={repoID} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                                }
                            </ListItem>
                        </React.Fragment>
                    )
                })}
            </List>
        )
    }
}


type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    selectedRepo?: string | undefined
    classes: any
}

interface StateProps {
    localRepoList: LocalURI[]
    repoIDsByPath: { [repoRoot: string]: string }
    filesByURI: { [uri: string]: { [name: string]: IRepoFile } }
}

const styles = (theme: Theme) => createStyles({
    selected: {
        backgroundColor: theme.palette.action.hover,
    },
    badge: {
        top: 6,
        width: 8,
        left: -16,
        height: 8,
    },
    sidebarItemText: {
        color: 'rgb(212, 212, 212)',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        localRepoList: state.repo.localRepoList,
        repoIDsByPath: state.repo.repoIDsByPath,
        filesByURI: state.repo.filesByURI,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoList))
