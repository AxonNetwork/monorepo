import React from 'react'
import classnames from 'classnames'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'

import { IRepo, URIType, RepoPage } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { selectRepo } from 'conscience-components/navigation'


@autobind
class RepoList extends React.Component<Props>
{
    render() {
        const { repos, selectedRepo, classes } = this.props
        return (
            <List>
                {
                    Object.keys(repos).sort().map((folderPath: string) => {
                        let repo = repos[folderPath]
                        let isChanged = false
                        const files = repo.files
                        if (files !== undefined) {
                            isChanged = Object.keys(files).some(
                                (name) => files[name].status === 'M' || files[name].status === '?' || files[name].status === 'U',
                            )
                        }
                        const isSelected = repo.path === selectedRepo
                        return (
                            <React.Fragment key={repo.path}>
                                <ListItem
                                    button
                                    dense
                                    className={classnames({ [classes.selected]: isSelected })}
                                    onClick={() => selectRepo({ type: URIType.Local, repoRoot: repo.path! }, RepoPage.Home)}
                                >
                                    {isChanged &&
                                        <Badge classes={{ badge: classes.badge }} badgeContent="" color="secondary">
                                            <ListItemText primary={repo.repoID} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                                        </Badge>
                                    }
                                    {!isChanged &&
                                        <ListItemText primary={repo.repoID} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                                    }
                                </ListItem>
                            </React.Fragment>
                        )
                    })
                }
            </List>
        )
    }
}

interface Props {
    repos: { [repoRoot: string]: IRepo }
    selectedRepo?: string | undefined
    classes: any
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

export default withStyles(styles)(RepoList)