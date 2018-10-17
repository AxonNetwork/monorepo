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

import { setCodeColorScheme, hideMenuLabels, logout, uploadUserPicture, modifyUserEmail } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import autobind from 'utils/autobind'
import CodeViewer from '../Repository/elements/CodeViewer'
import schemes from 'utils/codeColorSchemes'

@autobind
class Settings extends React.Component<Props>
{
    _inputUserPicture!: HTMLInputElement | null
    _inputNewEmail!: HTMLInputElement | null

    onChangeCodeColorScheme(evt: any) {
        this.props.setCodeColorScheme({ codeColorScheme: evt.target.value })
    }

    onChangeHideMenuLabels(evt: any) {
        const menuLabelsHidden = evt.target.checked
        this.props.hideMenuLabels({ menuLabelsHidden })
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
                <div className={classes.pageTitle}>
                    <Typography variant="h5" className={classes.headline}>Settings</Typography>
                </div>

                <div className={classes.contentArea}>
                    <div className={classnames(classes.section, classes.sectionAccount)}>
                        <Typography variant="h6"><strong>Your account</strong></Typography>
                        <div className={classes.sectionAccountContent}>
                            {/* Profile picture */}
                            <div>
                                <Typography variant="subtitle1"><strong>Profile picture</strong></Typography>

                                {this.props.currentUserPicture &&
                                    <img src={this.props.currentUserPicture} className={classes.currentUserPicture} />
                                }
                                <input type="file" ref={x => this._inputUserPicture = x} /><br/>
                                <Button variant="contained" color="secondary" className={classes.button} onClick={this.uploadUserPicture}>Upload</Button>
                            </div>

                            {/* Emails */}
                            <div>
                                <Typography variant="subtitle1"><strong>Email addresses</strong></Typography>
                                <List dense classes={{ root: classes.emailList }}>
                                    {this.props.currentUserEmails.map(email => (
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
                    </div>

                    <div className={classes.section}>
                        <Typography variant="h6"><strong>Code color scheme</strong></Typography>

                        <Select onChange={this.onChangeCodeColorScheme} value={this.props.codeColorScheme}>
                            {Object.keys(schemes).map(s => (
                                <MenuItem value={s}>{s}</MenuItem>
                            ))}
                        </Select>
                        <CodeViewer
                            language="go"
                            contents={codeSample}
                        />
                    </div>


                    <div className={classes.section}>
                        <Typography variant="subheading"><strong>Miscellaneous</strong></Typography>

                        <FormControlLabel control={
                            <Checkbox
                                checked={this.props.menuLabelsHidden}
                                onChange={this.onChangeHideMenuLabels}
                                value="hideMenuLabels"
                            />
                        }
                        label="Hide menu labels" />
                    </div>


                    <div className={classes.section}>
                        <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.props.logout()}>
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    async uploadUserPicture() {
        if (this._inputUserPicture !== null && this.props.currentUser !== undefined) {
            await this.props.uploadUserPicture({ fileInput: this._inputUserPicture, userID: this.props.currentUser })
        }
    }

    async addEmail() {
        if (!this.props.currentUser) {
            return
        } else if (!this._inputNewEmail) {
            return
        }

        const email = this._inputNewEmail.value
        // @@TODO: input validation + error
        this.props.modifyUserEmail({ userID: this.props.currentUser, email, add: true })
        this._inputNewEmail.value = ''
    }

    async removeEmail(email: string) {
        if (!this.props.currentUser) {
            return
        }
        this.props.modifyUserEmail({ userID: this.props.currentUser, email, add: false })
    }
}

interface Props {
    currentUser: string | undefined
    currentUserPicture: string | undefined
    currentUserEmails: string[]
    codeColorScheme: string | undefined
    setCodeColorScheme: typeof setCodeColorScheme
    menuLabelsHidden: boolean | undefined
    hideMenuLabels: typeof hideMenuLabels
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
        paddingRight: 50,
        display: 'flex',
        flexDirection: 'column',
    },
    pageTitle: {
        width: '100%',
        padding: 20,
        borderBottom: '1px solid #e4e4e4',
    },
    contentArea: {
        paddingTop: 20,
        overflowY: 'auto',
        flexGrow: 1,
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
        currentUser: state.user.currentUser,
        currentUserPicture: (state.user.users[ state.user.currentUser || '' ] || {}).picture,
        currentUserEmails: (state.user.users[ state.user.currentUser || '' ] || {}).emails || [],
        codeColorScheme: state.user.codeColorScheme,
        menuLabelsHidden: state.user.menuLabelsHidden,
    }
}

const mapDispatchToProps = {
    setCodeColorScheme,
    hideMenuLabels,
    logout,
    uploadUserPicture,
    modifyUserEmail,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Settings))