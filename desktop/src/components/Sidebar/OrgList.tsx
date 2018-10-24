import React from 'react'
import classnames from 'classnames'
import { createStyles, withStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { IOrganization } from 'common'
import autobind from 'utils/autobind'


@autobind
class OrgList extends React.Component<Props, State>
{
    state={
        dialogOpen: false,
    }

    _inputName : HTMLInputElement | null = null

    render() {
        const { orgs, selectedOrg, classes } = this.props
        return (
            <React.Fragment>
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
                    <ListItem
                        button
                        dense
                        onClick={this.onClickOpenOrgDialog}
                    >
                        <ListItemText primary="New  +" primaryTypographyProps={{ classes: { root: classes.sidebarItemText } }} />
                    </ListItem>
                    <Divider />
                </List>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this.handleDialogClose as any}
                    classes={{ paper: classes.dialog }}
                >
                    <DialogTitle>Create Organization</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Organization Name"
                            fullWidth
                            inputRef={x => this._inputName = x}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onClickCreateOrganization} color="secondary">Create</Button>
                        <Button onClick={this.handleDialogClose} color="secondary" autoFocus>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

        )
    }

    onClickOpenOrgDialog() {
        this.setState({ dialogOpen: true})
    }

    handleDialogClose() {
        this.setState({ dialogOpen: false })
    }

    onClickCreateOrganization() {
        if(this._inputName !== null && this._inputName.value !== undefined){
            const name = this._inputName.value
            this.props.createOrg({ name })
        }

        this.handleDialogClose()
    }
}

interface Props {
    orgs: {[orgID: string]: IOrganization}
    selectedOrg?: string|null
    selectOrg: Function
    createOrg: Function
    classes: any
}

interface State {
    dialogOpen: boolean
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
    dialog: {
        minWidth: 350
    }
})

export default withStyles(styles)(OrgList)