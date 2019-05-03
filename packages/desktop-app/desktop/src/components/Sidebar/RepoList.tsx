import sortBy from 'lodash/sortBy'
import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
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
        const { localRepoList, repoIDsByPath, filesByURI, filesAreDirtyByURI, selectedRepo, classes } = this.props
        return (
            <List>
                {sortBy(localRepoList, uri => repoIDsByPath[uri.repoRoot].toLowerCase()).map((uri: LocalURI) => {
                    const repoID = repoIDsByPath[uri.repoRoot]
                    const uriStr = uriToString(uri)
                    let isChanged = filesAreDirtyByURI[uriStr]
                    const files = filesByURI[uriStr]
                    if (files !== undefined && !isChanged) {
                        isChanged = Object.keys(files).some(
                            (name) => files[name].status === 'M' || files[name].status === '?' || files[name].status === 'U',
                        )
                    }
                    const isSelected = uri.repoRoot === selectedRepo
                    return (
                        <ListItem
                            key={uri.repoRoot}
                            button
                            dense
                            className={classnames({ [classes.selected]: isSelected })}
                            onClick={() => selectRepo(uri, RepoPage.Home)}
                        >
                            {isChanged &&
                                <Badge classes={{ badge: classes.badge }} showZero badgeContent="" color="secondary">
                                    <ListItemText primary={repoID} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                                </Badge>
                            }
                            {!isChanged &&
                                <ListItemText primary={repoID} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                            }
                        </ListItem>
                    )
                })}
                <ListItem
                    button
                    dense
                    onClick={this.onClickNewRepo}
                >
                    <ListItemText primary="+ New" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                </ListItem>
            </List>
        )
    }

    onClickNewRepo = () => {
        this.props.history.push(`/new-repo`)
    }
}


type Props = OwnProps & StateProps & RouteComponentProps & { classes: any }

interface OwnProps {
    selectedRepo?: string | undefined
}

interface StateProps {
    localRepoList: LocalURI[]
    repoIDsByPath: { [repoRoot: string]: string }
    filesByURI: { [uri: string]: { [name: string]: IRepoFile } }
    filesAreDirtyByURI: { [uri: string]: boolean }
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
        minWidth: 'unset',
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
        filesAreDirtyByURI: state.repo.filesAreDirtyByURI,
    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(RepoList)))
