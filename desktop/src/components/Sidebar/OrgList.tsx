import React from 'react'
import classnames from 'classnames'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'

import { IOrganization } from 'common'
import autobind from 'utils/autobind'


@autobind
class OrgList extends React.Component<Props>
{
    render() {
        const { orgs, selectedOrg, classes } = this.props
        return (
            <List>
                {
                    Object.keys(orgs).sort().map((orgID: string) => {
                        const org = orgs[orgID]
                        const isSelected = orgID === selectedOrg
                        return (
                            <React.Fragment key={orgID}>
                                <ListItem
                                    button
                                    dense
                                    className={classnames({ [classes.selected]: isSelected })}
                                    onClick={() => this.props.selectOrg({ orgID })}
                                >
                                <ListItemText primary={org.name} primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        )
                    })
                }
            </List>
        )
    }
}

interface Props {
    orgs: {[orgID: string]: IOrganization}
    selectedOrg?: string|null
    selectOrg: Function
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

export default withStyles(styles)(OrgList)