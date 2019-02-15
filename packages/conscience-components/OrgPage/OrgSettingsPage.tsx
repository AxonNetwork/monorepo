import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import { updateOrg, uploadOrgPicture, uploadOrgBanner, updateOrgColors } from 'conscience-components/redux/org/orgActions'
import { H6 } from 'conscience-components/Typography/Headers'
import { IOrganization } from 'conscience-lib/common'
import { autobind, nonCacheImg } from 'conscience-lib/utils'


@autobind
class OrganizationPage extends React.Component<Props, State>
{
    _inputOrgName: HTMLInputElement | null = null
    _inputDescription: HTMLInputElement | null = null
    _inputOrgPicture: HTMLInputElement | null = null
    _inputBanner: HTMLInputElement | null = null

    state = {
        primaryColor: ''|'black',
        secondaryColor: ''|'black',
        primaryHover: false,
        secondaryHover: false
    }

    render() {
        const { org, classes } = this.props
        console.log(org.picture)
        const hasOrgPicture = org.picture && Object.keys(org.picture).length !== 0
        console.log(hasOrgPicture)

        return (
            <div className={classes.settingsPage}>

                {/* Change Org Name or Description */}

                <div className={classes.settings}>
                    <H6 className={classes.header}>Settings</H6>
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

                {/* Change Org Primary and Secondary Theme Colors */}

                <div className={classes.colorsSection}>
                    <div>
                        <Fab size='medium'
                            onClick={this.openColorDialog}
                            onMouseEnter={() => this.setState({primaryHover: true})} 
                            onMouseOut={() => this.setState({primaryHover: false})}
                            style={{backgroundColor: 'pink', boxShadow: this.state.primaryHover ? 
                            '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)' : 'none' }}>
                        </Fab>
                        Primary Color
                    </div>
                    <div>
                        <Fab size='medium'
                            onClick={this.openColorDialog}
                            onMouseEnter={() => this.setState({secondaryHover: true})} 
                            onMouseOut={() => this.setState({secondaryHover: false})}
                            style={{backgroundColor: 'purple', boxShadow: this.state.secondaryHover ? 
                            '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)' : 'none' }}>
                        </Fab>
                        Secondary Color
                    </div>
                </div>

                {/* Upload Banner or Profile Pictures */}

                <div className={classes.images}>
                    <div className={classes.imageContainer}>
                        {!hasOrgPicture &&
                            <div>No Image Uploaded</div>
                        }
                        {hasOrgPicture &&
                            <div>
                                <div>Current Image:</div>
                                <img src={nonCacheImg(org.picture['256x256'])} className={classes.orgPicture} />
                            </div>
                        }
                        <input type="file" ref={x => this._inputOrgPicture = x} /><br />
                        <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClickUploadOrgImage}>Upload</Button>
                    </div>
                    <div className={classes.imageContainer}>
                        {org.banner.length === 0 &&
                            <div>No Banner Uploaded</div>
                        }
                        {org.banner.length > 0 &&
                            <div>
                                <div>Current Banner:</div>
                                <img src={nonCacheImg(org.banner)} className={classes.orgPicture} />
                            </div>
                        }
                        <input type="file" ref={x => this._inputBanner = x} /><br />
                        <Button variant="contained" color="secondary" className={classes.button} onClick={this.onClickUploadBanner}>Upload</Button>
                    </div>
                </div >
            </div >
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

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface MatchParams {
    orgID: string
}

interface State {
    primaryHover: boolean
    secondaryHover: boolean
}

interface OwnProps extends RouteComponentProps<MatchParams> { }

interface StateProps {
    org: IOrganization
}

interface DispatchProps {
    updateOrg: typeof updateOrg
    uploadOrgPicture: typeof uploadOrgPicture
    uploadOrgBanner: typeof uploadOrgBanner
}

const styles = (theme: Theme) => createStyles({
    settingsPage: {
        minWidth: 450,
        maxWidth: 650,
        display: 'flex',
        flexDirection: 'column',
    },
    colorsSection: {
        display: 'flex',
        marginTop: 32,
    },
    images: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eaeaea82',
        padding: 32,
        marginTop: 32,
    },
    imageContainer: {
        width: '50%',
        marginTop: theme.spacing.unit * 2,
        '& img': {
            marginTop: 8,
            marginBottom: 8,
        },
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
        height: 100,
        display: 'block',
    },
})

interface IPartialState {
    org: {
        orgs: { [orgID: string]: IOrganization }
    }
}

const mapStateToProps = (state: IPartialState, props: RouteComponentProps<MatchParams>) => {
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
    updateOrgColors
}

export default connect<StateProps, DispatchProps, OwnProps, IPartialState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrganizationPage))
