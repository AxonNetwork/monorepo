import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import IconButton from '@material-ui/core/IconButton'
import LocationCityIcon from '@material-ui/icons/LocationCity'
import SchoolIcon from '@material-ui/icons/School'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import { IUser } from 'conscience-lib/common'
import { IGlobalState } from 'conscience-components/redux'
import { updateUserProfile } from 'conscience-components/redux/user/userActions'
import { autobind } from 'conscience-lib/utils'

const orcidLogo = require('../assets/orcid.png')


@autobind
class UserProfile extends React.Component<Props, State>
{
    _inputBio: HTMLInputElement | null = null
    _inputLocation: HTMLInputElement | null = null
    _inputUniversity: HTMLInputElement | null = null
    _inputOrcid: HTMLInputElement | null = null
    _inputAddInterest: HTMLInputElement | null = null

    state = {
        editing: false,
        showInterestForm: false,
        interests: [] as string[],
    }

    render() {
        const { interests } = this.state
        const { user, currentUser, classes } = this.props
        const { bio = undefined, geolocation = undefined, university = undefined, orcid = undefined } = (user.profile || {})
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
                    {interests && interests.length > 0 &&
                        <div className={classes.interests}>
                            <Typography>
                                Fields & Interests:
                            </Typography>
                            {interests.map((interest: string) => (
                                <Chip
                                    key={interest}
                                    label={interest}
                                    className={classes.chip}
                                />
                            ))}
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
            return (
                <div className={classes.root}>
                    <TextField
                        label="Bio"
                        className={classes.textField}
                        inputRef={x => this._inputBio = x}
                        defaultValue={bio}
                        multiline
                        rows={2}
                        rowsMax={2}
                    />
                    <TextField
                        label="Location"
                        className={classes.textField}
                        inputRef={x => this._inputLocation = x}
                        defaultValue={geolocation}
                    />
                    <TextField
                        label="University"
                        className={classes.textField}
                        inputRef={x => this._inputUniversity = x}
                        defaultValue={university}
                    />
                    <TextField
                        label="Orcid"
                        className={classes.textField}
                        inputRef={x => this._inputOrcid = x}
                        defaultValue={orcid}
                    />
                    <div className={classes.interests}>
                        <Typography>
                            Fields &amp; Interests:
                        </Typography>
                        {interests && interests.map((interest: string) => (
                            <Chip
                                key={interest}
                                label={interest}
                                className={classes.chip}
                                onDelete={() => this.deleteInterest(interest)}
                            />
                        ))}
                        {!this.state.showInterestForm &&
                            <IconButton
                                color="secondary"
                                onClick={this.toggleInterestForm}
                            >
                                <ControlPointIcon fontSize="small" />
                            </IconButton>
                        }
                        {this.state.showInterestForm &&
                            <form onSubmit={this.addInterest}>
                                <Input autoFocus inputRef={x => this._inputAddInterest = x} />
                            </form>
                        }
                    </div>
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

    componentDidMount() {
        if (this.props.user.profile) {
            const interests = this.props.user.profile.interests
            this.setState({ interests })
        }
    }

    toggleEditing() {
        this.setState({ editing: !this.state.editing })
    }

    toggleInterestForm() {
        this.setState({ showInterestForm: !this.state.showInterestForm })
    }

    addInterest(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (this._inputAddInterest === null) {
            return
        }
        const interest = this._inputAddInterest.value
        this._inputAddInterest.value = ''
        this.setState({
            showInterestForm: false,
            interests: [
                ...this.state.interests,
                interest,
            ],
        })
    }

    deleteInterest(interest: string) {
        const interests = this.state.interests.filter(i => i !== interest)
        this.setState({ interests })
    }

    saveProfile() {
        const userID = this.props.currentUser || ''
        const profile = {
            bio: this._inputBio !== null ? this._inputBio.value : '',
            geolocation: this._inputLocation !== null ? this._inputLocation.value : '',
            university: this._inputUniversity !== null ? this._inputUniversity.value : '',
            orcid: this._inputOrcid !== null ? this._inputOrcid.value : '',
            interests: this.state.interests,
        }

        this.props.updateUserProfile({ userID, profile })
        this.setState({ editing: false })
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    user: IUser
}

interface StateProps {
    currentUser: string | undefined
}

interface DispatchProps {
    updateUserProfile: typeof updateUserProfile
}

interface State {
    editing: boolean
    showInterestForm: boolean
    interests: string[]
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
    interests: {
        marginTop: 8,
    },
    chip: {
        marginTop: 4,
        marginRight: 4,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        currentUser: state.user.currentUser,
    }
}

const mapDispatchToProps = {
    updateUserProfile,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserProfile))

