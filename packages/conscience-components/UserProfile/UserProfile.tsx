import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LocationCityIcon from '@material-ui/icons/LocationCity'
import SchoolIcon from '@material-ui/icons/School'
import { IUser, IUserProfile } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'

const orcidLogo = require('../assets/orcid.png')


@autobind
class UserProfile extends React.Component<Props, State>
{
    _inputBio: HTMLInputElement | null = null
    _inputLocation: HTMLInputElement | null = null
    _inputUniversity: HTMLInputElement | null = null
    _inputOrcid: HTMLInputElement | null = null

    state = {
        editing: false,
    }

    render() {
        const { user, currentUser, classes } = this.props
        const { bio, geolocation, university, orcid } = user.profile
        const ownProfile = user.userID === currentUser
        if (!this.state.editing) {
            return (
                <div className={classes.root}>
                    {bio && bio.length > 0 &&
                        <Typography className={classes.bio}>
                            {bio}
                        </Typography>
                    }
                    {geolocation && geolocation.length > 0 &&
                        <div className={classes.profileLine}>
                            <LocationCityIcon />
                            <Typography>
                                {geolocation}
                            </Typography>
                        </div>
                    }
                    {university && university.length > 0 &&
                        <div className={classes.profileLine}>
                            <SchoolIcon />
                            <Typography>
                                {university}
                            </Typography>
                        </div>
                    }
                    {orcid && orcid.length > 0 &&
                        <div className={classes.profileLine}>
                            <img src={orcidLogo} />
                            <Typography>
                                {orcid}
                            </Typography>
                        </div>
                    }
                    {ownProfile &&
                        <div className={classes.buttons}>
                            <Button
                                color="secondary"
                                variant="outlined"
                                onClick={this.toggleEditing}
                                className={classes.button}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    }
                </div>
            )
        } else {
            return(
                <div className={classes.root}>
                    <TextField
                        label="Bio"
                        className={classes.textField}
                        inputRef={ x => this._inputBio = x }
                        defaultValue={bio}
                        multiline
                        rows={2}
                        rowsMax={2}
                    />
                    <TextField
                        label="Location"
                        className={classes.textField}
                        inputRef={ x => this._inputLocation = x }
                        defaultValue={geolocation}
                    />
                    <TextField
                        label="University"
                        className={classes.textField}
                        inputRef={ x => this._inputUniversity = x }
                        defaultValue={university}
                    />
                    <TextField
                        label="Orcid"
                        className={classes.textField}
                        inputRef={ x => this._inputOrcid = x }
                        defaultValue={orcid}
                    />
                    <div className={classes.buttons}>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={this.saveProfile}
                            className={classes.button}
                        >
                            Save
                        </Button>
                        <div className={classes.spacer} />
                        <Button
                            color="secondary"
                            variant="outlined"
                            onClick={this.toggleEditing}
                            className={classes.button}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )
        }
    }

    toggleEditing() {
        this.setState({ editing: !this.state.editing })
    }

    saveProfile() {
        const userID = this.props.currentUser || ''
        const profile = {
            bio: this._inputBio !== null ? this._inputBio.value : '',
            geolocation: this._inputLocation !== null ? this._inputLocation.value : '',
            university: this._inputUniversity !== null ? this._inputUniversity.value : '',
            orcid: this._inputOrcid !== null ? this._inputOrcid.value : '',
            fields: [] as string[],
        }

        this.props.updateUserProfile({ userID, profile })
        this.setState({ editing: false })
    }

}

interface State {
    editing: boolean
}

interface Props {
    user: IUser
    currentUser: string
    updateUserProfile: (payload: { userID: string, profile: IUserProfile }) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {
        marginBottom: 16,
        marginTop: 16,
    },
    buttons: {
        marginTop: 16,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        textTransform: 'none',
        width: '50%',
    },
    spacer: {
        width: 16,
    },
    textField: {
        width: '100%',
    },
    bio: {
        marginBottom: 16,
    },
    profileLine: {
        display: 'flex',
        flexDirection: 'row',
        '& svg': {
            marginRight: 8,
        },
        '& img': {
            width: 22,
            height: 22,
            marginRight: 8,
        },
    },
})

export default withStyles(styles)(UserProfile)

