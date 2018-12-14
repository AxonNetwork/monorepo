import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import DeleteIcon from '@material-ui/icons/Delete'
import CodeViewer from 'conscience-components/CodeViewer'
import { updateUserSettings, uploadUserPicture, modifyUserEmail } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import { IUser, IUserSettings} from 'conscience-lib/common'
import { autobind, schemes } from 'conscience-lib/utils'


@autobind
class SettingsPage extends React.Component<Props>
{

    _inputUserPicture!: HTMLInputElement | null
    _inputNewEmail!: HTMLInputElement | null

	render() {
		const { user, userSettings, classes } = this.props
        if (user === undefined){
            return <div>Not logged in</div>
        }
		return (
			<div className={classes.container}>
				<main className={classes.main}>
					<Typography variant="h5" className={classes.pageTitle}>
						Settings
					</Typography>
                    <section className={classnames(classes.section, classes.sectionAccount)}>
                        <Typography variant="h6"><strong>Your account</strong></Typography>
                        <div className={classes.sectionAccountContent}>
                            {/* Profile picture */}
                            <div>
                                <Typography variant="subtitle1"><strong>Profile picture</strong></Typography>

                                {user.picture &&
                                    <img src={user.picture} className={classes.currentUserPicture} />
                                }
                                <input type="file" ref={x => this._inputUserPicture = x} /><br/>
                                <Button variant="contained" color="secondary" className={classes.button} onClick={this.uploadUserPicture}>Upload</Button>
                            </div>

                            {/* Emails */}
                            <div>
                                <Typography variant="subtitle1"><strong>Email addresses</strong></Typography>
                                <List dense classes={{ root: classes.emailList }}>
                                    {user.emails.map(email => (
                                        <ListItem classes={{ root: classes.emailListItem }}>
                                            <ListItemText primary={email} />
                                            <ListItemSecondaryAction>
                                                <IconButton onClick={() => this.removeEmail(email)} aria-label="Delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                </List>

                                <Typography>Add another email address:</Typography>
                                <TextField
                                    inputRef={x => this._inputNewEmail = x}
                                    classes={{ root: classes.newEmailInput }}
                                    />
                                <Button variant="contained" color="secondary" className={classes.button} onClick={this.addEmail}>Add</Button>
                            </div>
                        </div>
                    </section>

                    <section className={classes.section}>
                        <Typography variant="h6"><strong>Code color scheme</strong></Typography>

                        <Select onChange={this.onChangeCodeColorScheme} value={userSettings.codeColorScheme}>
                            {Object.keys(schemes).map(s => (
                                <MenuItem value={s}>{s}</MenuItem>
                            ))}
                        </Select>
                        <CodeViewer
                            language="go"
                            contents={codeSample}
                            codeColorScheme={userSettings.codeColorScheme}
                        />
                    </section>
                    <section className={classes.section}>
                        <Typography variant="subheading"><strong>Miscellaneous</strong></Typography>

                        <FormControlLabel control={
                            <Checkbox
                                checked={userSettings.menuLabelsHidden}
                                onChange={this.onChangeHideMenuLabels}
                                value="hideMenuLabels"
                            />
                        }
                        label="Hide menu labels" />

                        <FormControlLabel control={
                            <Checkbox
                                checked={userSettings.fileExtensionsHidden}
                                onChange={this.onChangeHideFileExtensions}
                                value="hideFileExtensions"
                            />
                        }
                        label="Hide file extensions" />
                    </section>
				</main>
			</div>
		)
	}

    onChangeCodeColorScheme(evt: any) {
        const settings = { codeColorScheme: evt.target.value }
        this.props.updateUserSettings({ settings })
    }

    onChangeHideMenuLabels(evt: any) {
        const settings = { menuLabelsHidden: evt.target.checked }
        this.props.updateUserSettings({ settings })
    }

    onChangeHideFileExtensions(evt: any) {
        const settings = { fileExtensionsHidden: evt.target.checked }
        this.props.updateUserSettings({ settings })
    }

    async uploadUserPicture() {
        if (this._inputUserPicture !== null && this.props.user !== undefined) {
            await this.props.uploadUserPicture({ fileInput: this._inputUserPicture, userID: this.props.user.userID })
        }
    }

    async addEmail() {
        if (!this.props.user) {
            return
        } else if (!this._inputNewEmail) {
            return
        }

        const email = this._inputNewEmail.value
        // @@TODO: input validation + error
        this.props.modifyUserEmail({ userID: this.props.user.userID, email, add: true })
        this._inputNewEmail.value = ''
    }

    async removeEmail(email: string) {
        if (!this.props.user) {
            return
        }
        this.props.modifyUserEmail({ userID: this.props.user.userID, email, add: false })
    }
}

interface Props {
    user: IUser
    userSettings: IUserSettings
	updateUserSettings: typeof updateUserSettings
    uploadUserPicture: typeof uploadUserPicture
    modifyUserEmail: typeof modifyUserEmail
	classes: any
}

const styles = (theme: Theme) => createStyles({
	container: {
		display: 'flex',
		justifyContent: 'center',
	},
	main: {
		width: '80%',
		marginTop: 32,
	},
    pageTitle:{
        width: '100%',
        padding: 20,
        borderBottom: '1px solid #e4e4e4',
    },
    section: {
        marginBottom: theme.spacing.unit * 4,
        padding: 20,
        width: '100%',
    },
    sectionAccount: {
        backgroundColor: '#eaeaea82',
        borderRadius: 5,
    },
    sectionAccountContent: {
        display: 'flex',
        paddingTop: 20,
    },
    button: {
        textTransform: 'none',
    },
    currentUserPicture: {
        width: 100,
        height: 100,
        display: 'block',
    },
    emailList: {
        paddingBottom: 30,
    },
    emailListItem: {
        paddingLeft: 4,
    },
    newEmailInput: {
        paddingRight: 10,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        user: state.user.users[state.user.currentUser || ''],
        userSettings: state.user.userSettings,
    }
}

const mapDispatchToProps = {
	updateUserSettings,
    uploadUserPicture,
    modifyUserEmail,
}

const SettingsPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SettingsPage))

export default SettingsPageContainer

var codeSample =
`var inflightLimiter = make(chan struct{}, 5)

func init() {
    for i := 0; i < 5; i++ {
        inflightLimiter <- struct{}{}
    }
}

func fetch(hash gitplumbing.Hash) error {
    wg := &sync.WaitGroup{}
    chErr := make(chan error)

    wg.Add(1)
    go recurseObject(hash, wg, chErr)

    chDone := make(chan struct{})
    go func() {
        defer close(chDone)
        wg.Wait()
    }()
`