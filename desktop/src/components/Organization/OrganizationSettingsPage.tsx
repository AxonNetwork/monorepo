import React from 'react'
import { connect } from 'react-redux'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import { updateOrg, uploadOrgPicture } from 'redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization } from 'common'
import autobind from 'utils/autobind'


@autobind
class OrganizationPage extends React.Component<Props>
{
    _inputOrgName: HTMLInputElement | null = null
    _inputDescription: HTMLInputElement | null = null
    _inputOrgPicture: HTMLInputElement | null = null

    render(){
        const { org, updateOrgLoading, classes } = this.props
        return(
            <div className={classes.settingsPage}>
                <div className={classes.settings}>
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
                        disabled={updateOrgLoading}
                        onClick={this.onClickUpdateOrgSettings}
                    >
                        Update
                        {updateOrgLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
                    </Button>
                </div>
                <div className={classes.imageContainer}>
                    {org.picture.length === 0 &&
                        <Typography>
                            No image Uploaded
                        </Typography>
                    }
                    {org.picture.length > 0 &&
                        <React.Fragment>
                            <Typography>
                                Current Image:
                            </Typography>
                            <img src={org.picture} className={classes.orgPicture}/>
                        </React.Fragment>
                    }
                    <input type="file" ref={x => this._inputOrgPicture = x} /><br/>
                    <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClickUploadOrgImage}>Upload</Button>
                </div>
            </div>
        )
    }

    onClickUpdateOrgSettings() {
        const orgID = this.props.org.orgID
        const name = this._inputOrgName !== null ? this._inputOrgName.value : ""
        const description = this._inputDescription !== null ? this._inputDescription.value : ""
        this.props.updateOrg({ orgID, name, description })
    }

    onClickUploadOrgImage() {
        if(this._inputOrgPicture === null){
            return
        }
        const fileInput = this._inputOrgPicture
        const orgID = this.props.org.orgID
        this.props.uploadOrgPicture({ fileInput, orgID })
    }
}

interface Props {
    org: IOrganization
    updateOrgLoading: boolean
    updateOrg: typeof updateOrg
    uploadOrgPicture: typeof uploadOrgPicture
    classes: any
}

const styles = (theme: Theme) => createStyles({
    settingsPage: {
        minWidth: 450,
        maxWidth: 650
    },
    settings: {
    },
    imageContainer: {
        marginTop: theme.spacing.unit * 2,
        '& button': {
            marginTop: theme.spacing.unit * 2
        }
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
    orgPicture: {
        width: 100,
        display: 'block'
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const selectedOrg = state.org.selectedOrg || ""
    const org = state.org.orgs[selectedOrg]
    const updateOrgLoading = state.ui.updateOrgLoading
    return {
        org,
        updateOrgLoading,
    }
}

const mapDispatchToProps = {
    updateOrg,
    uploadOrgPicture,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrganizationPage))