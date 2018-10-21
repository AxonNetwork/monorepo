import React from 'react'
import { connect } from 'react-redux'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { updateOrg } from 'redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization } from 'common'
import autobind from 'utils/autobind'


@autobind
class OrganizationPage extends React.Component<Props>
{
    _inputOrgName: HTMLInputElement | null = null
    _inputDescription: HTMLInputElement | null = null

    render(){
        const { org, orgSettingsLoading, classes } = this.props
        return(
            <div className={classes.settingsContainer}>
                <Typography variant="h6" className={classes.header}>
                    Settings
                </Typography>
                <TextField
                    label="Organization Name"
                    inputRef={ x => this._inputOrgName = x }
                    defaultValue={org.name}
                    className={classes.input}
                    fullWidth
                />
                <TextField
                    label="Description"
                    inputRef={ x => this._inputDescription = x }
                    defaultValue={org.description}
                    className={classes.input}
                    fullWidth
                    multiline
                    rows={2}
                />
                <Button
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                    disabled={orgSettingsLoading}
                    onClick={this.onClickUpdateOrgSettings}
                >
                    Update
                    {orgSettingsLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
                </Button>
            </div>
        )
    }

    onClickUpdateOrgSettings() {
        const orgID = this.props.org.orgID
        const name = this._inputOrgName !== null ? this._inputOrgName.value : ''
        const description = this._inputDescription !== null ? this._inputDescription.value : ''
        this.props.updateOrg({ orgID, name, description })
    }
}

interface Props {
    org: IOrganization
    orgSettingsLoading: boolean
    updateOrg: typeof updateOrg
    classes: any
}

const styles = (theme: Theme) => createStyles({
    settingsContainer: {
        minWidth: 450,
        maxWidth: 750,
    },
    header: {
        marginBottom: theme.spacing.unit * 2
    },
    input: {
        marginBottom: theme.spacing.unit * 2
    },
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const selectedOrg = state.org.selectedOrg || ""
    const org = state.org.orgs[selectedOrg]
    const orgSettingsLoading = state.ui.orgSettingsLoading
    return {
        org,
        orgSettingsLoading,
    }
}

const mapDispatchToProps = {
    updateOrg
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrganizationPage))