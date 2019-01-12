import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { updateOrg, uploadOrgPicture, uploadOrgBanner } from 'redux/org/orgActions'
import { IGlobalState } from 'redux/store'
import { IOrganization } from 'conscience-lib/common'
import { autobind, nonCacheImg } from 'conscience-lib/utils'


@autobind
class OrganizationPage extends React.Component<Props>
{
    _inputOrgName: HTMLInputElement | null = null
    _inputDescription: HTMLInputElement | null = null
    _inputOrgPicture: HTMLInputElement | null = null
    _inputBanner: HTMLInputElement | null = null

    render() {
        const { org, classes } = this.props
        return (
            <div className={classes.settingsPage}>
                <div className={classes.settings}>
                    <Typography variant="h6" className={classes.header}>
                        Settings
                    </Typography>
                    <TextField
                        key={org.orgID + ':1'}
                        label="Organization Name"
                        inputRef={x => this._inputOrgName = x}
                        defaultValue={org.name}
                        className={classes.input}
                        fullWidth
                    />
                    <TextField
                        key={org.orgID + ':2'}
                        label="Description"
                        inputRef={x => this._inputDescription = x}
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
                        onClick={this.onClickUpdateOrgSettings}
                    >
                        Update
                    </Button>
                </div>
                <div className={classes.imageContainer}>
                    {org.picture.length === 0 &&
                        <Typography>
                            No Image Uploaded
                        </Typography>
                    }
                    {org.picture.length > 0 &&
                        <div>
                            <Typography>
                                Current Image:
                            </Typography>
                            <img src={nonCacheImg(org.picture)} className={classes.orgPicture} />
                        </div>
                    }
                    <input type="file" ref={x => this._inputOrgPicture = x} /><br />
                    <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClickUploadOrgImage}>Upload</Button>
                </div>
                <div className={classes.imageContainer}>
                    {org.banner.length === 0 &&
                        <Typography>
                            No Banner Uploaded
                        </Typography>
                    }
                    {org.banner.length > 0 &&
                        <div>
                            <Typography>
                                Current Banner:
                            </Typography>
                            <img src={nonCacheImg(org.banner)} className={classes.orgPicture} />
                        </div>
                    }
                    <input type="file" ref={x => this._inputBanner = x} /><br />
                    <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClickUploadBanner}>Upload</Button>
                </div>
            </div>
        )
    }

    onClickUpdateOrgSettings() {
        const orgID = this.props.org.orgID
        const name = this._inputOrgName !== null ? this._inputOrgName.value : ''
        const description = this._inputDescription !== null ? this._inputDescription.value : ''
        this.props.updateOrg({ orgID, name, description })
    }

    onClickUploadOrgImage() {
        if (this._inputOrgPicture === null) {
            return
        }
        const fileInput = this._inputOrgPicture
        const orgID = this.props.org.orgID
        this.props.uploadOrgPicture({ fileInput, orgID })
    }

    onClickUploadBanner() {
        if (this._inputBanner === null) {
            return
        }
        const fileInput = this._inputBanner
        const orgID = this.props.org.orgID
        this.props.uploadOrgBanner({ fileInput, orgID })
    }
}

interface MatchParams {
    orgID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    org: IOrganization
    updateOrg: typeof updateOrg
    uploadOrgPicture: typeof uploadOrgPicture
    uploadOrgBanner: typeof uploadOrgBanner
    classes: any
}

const styles = (theme: Theme) => createStyles({
    settingsPage: {
        minWidth: 450,
        maxWidth: 650,
    },
    settings: {
    },
    imageContainer: {
        marginTop: theme.spacing.unit * 2,
        '& button': {
            marginTop: theme.spacing.unit * 2,
        },
    },
    header: {
        marginBottom: theme.spacing.unit * 2,
    },
    input: {
        marginBottom: theme.spacing.unit * 2,
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
        display: 'block',
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const orgID = props.match.params.orgID
    const org = state.org.orgs[orgID]
    return {
        org,
    }
}

const mapDispatchToProps = {
    updateOrg,
    uploadOrgPicture,
    uploadOrgBanner,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrganizationPage))