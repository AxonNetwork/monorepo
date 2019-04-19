import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'
import { H5 } from 'conscience-components/Typography/Headers'
import CodeViewer from 'conscience-components/CodeViewer'
import { setLocalConfig } from 'redux/user/userActions'
import { logout, uploadUserPicture, modifyUserEmail } from 'conscience-components/redux/user/userActions'
import { IGlobalState } from 'conscience-components/redux'
import { IUser, IUserSettings } from 'conscience-lib/common'
import { autobind, schemes } from 'conscience-lib/utils'
import LocalCache from 'lib/LocalCache'


@autobind
class SettingsPage extends React.Component<Props>
{
    _inputUserPicture!: HTMLInputElement | null
    _inputNewEmail!: HTMLInputElement | null

    render() {
        const { user, userSettings, classes } = this.props
        if (user === undefined) {
            return <div>Not logged in</div>
        }

        return (
            <div className={classes.root}>
                <H5 className={classes.pageTitle}>Settings</H5>

                <div className={classes.contentArea}>
                    <div className={classes.contentAreaInner}>
                        <section className={classnames(classes.section, classes.sectionAccount)}>
                            <Typography variant="h6"><strong>Your account</strong></Typography>
                            <div className={classes.sectionAccountContent}>
                                {/* Profile picture */}
                                <div>
                                    <Typography variant="subtitle1"><strong>Profile picture</strong></Typography>

                                    {user.picture &&
                                        <img src={user.picture['256x256']} className={classes.currentUserPicture} />
                                    }
                                    <input type="file" ref={x => this._inputUserPicture = x} /><br />
                                    <Button variant="contained" color="secondary" className={classes.button} onClick={this.uploadUserPicture}>Upload</Button>
                                </div>

                                {/* Emails */}
                                <div>
                                    <Typography variant="subtitle1"><strong>Email addresses</strong></Typography>
                                    <List dense classes={{ root: classes.emailList }}>
                                        {(user.emails || []).map(email => (
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
                                fileContents={codeSample}
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

                            <FormControlLabel control={
                                <Checkbox
                                    checked={userSettings.manualChunking}
                                    onChange={this.onChangeManualChunking}
                                    value="manualChunking"
                                />
                            }
                                label="Manual chunking" />
                        </section>


                        <section className={classes.section}>
                            <Button variant="contained" color="secondary" className={classes.button} onClick={this.clearCache}>
                                Clear cache
                            </Button>

                            <Button variant="contained" color="secondary" className={classes.button} onClick={this.props.logout}>
                                Logout
                            </Button>
                        </section>
                    </div>
                </div>
            </div>
        )
    }

    clearCache = () => {
        LocalCache.wipe()
    }

    onChangeCodeColorScheme(evt: any) {
        this.props.setLocalConfig({ config: { codeColorScheme: evt.target.value } })
    }

    onChangeHideMenuLabels(evt: any) {
        const menuLabelsHidden = evt.target.checked
        this.props.setLocalConfig({ config: { menuLabelsHidden } })
    }

    onChangeHideFileExtensions(evt: any) {
        const fileExtensionsHidden = evt.target.checked
        this.props.setLocalConfig({ config: { fileExtensionsHidden } })
    }

    onChangeManualChunking(evt: any) {
        const manualChunking = evt.target.checked
        this.props.setLocalConfig({ config: { manualChunking } })
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

    setLocalConfig: typeof setLocalConfig
    logout: typeof logout
    uploadUserPicture: typeof uploadUserPicture
    modifyUserEmail: typeof modifyUserEmail

    classes: any
}

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

const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    pageTitle: {
        fontSize: '2rem',
        color: 'rgba(0, 0, 0, 0.7)',
        borderBottom: '1px solid #e4e4e4',
        paddingBottom: 20,
    },
    contentArea: {
        overflowY: 'auto',
        flexGrow: 1,
    },
    contentAreaInner: {
        marginTop: theme.spacing.unit * 4,
        marginRight: theme.spacing.unit * 4,
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
    setLocalConfig,
    logout,
    uploadUserPicture,
    modifyUserEmail,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SettingsPage))