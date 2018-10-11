import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { setCodeColorScheme, hideMenuLabels, logout, uploadUserPicture } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import autobind from 'utils/autobind'
import CodeViewer from '../Repository/elements/CodeViewer'
import schemes from 'utils/codeColorSchemes'

@autobind
class Settings extends React.Component<Props>
{
    _inputUserPicture!: HTMLInputElement | null

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
            <div>
                <div className={classes.section}>
                    <Typography variant="headline" className={classes.headline}>Settings</Typography>
                </div>

                <div className={classes.section}>
                    <Typography variant="subheading"><strong>Code color scheme</strong></Typography>

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
                    <Typography variant="subheading"><strong>Profile picture</strong></Typography>

                    {this.props.currentUserPicture &&
                        <img src={this.props.currentUserPicture} className={classes.currentUserPicture} />
                    }
                    <input type="file" ref={x => this._inputUserPicture = x} /><br/>
                    <Button variant="contained" color="secondary" className={classes.button} onClick={this.uploadUserPicture}>Upload</Button>
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
        )
    }

    async uploadUserPicture() {
        if (this._inputUserPicture !== null && this.props.currentUser !== undefined) {
            await this.props.uploadUserPicture({ fileInput: this._inputUserPicture, userID: this.props.currentUser })
        }
    }
}

interface Props {
    currentUser: string | undefined
    currentUserPicture: string | undefined
    codeColorScheme: string | undefined
    setCodeColorScheme: typeof setCodeColorScheme
    menuLabelsHidden: boolean | undefined
    hideMenuLabels: typeof hideMenuLabels
    logout: typeof logout
    uploadUserPicture: typeof uploadUserPicture
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
    section: {
        marginBottom: theme.spacing.unit * 4,
    },
    button: {
        textTransform: 'none',
    },
    currentUserPicture: {
        width: 100,
        height: 100,
        display: 'block',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        currentUser: state.user.currentUser,
        currentUserPicture: (state.user.users[ state.user.currentUser || '' ] || {}).picture,
        codeColorScheme: state.user.codeColorScheme,
        menuLabelsHidden: state.user.menuLabelsHidden,
    }
}

const mapDispatchToProps = {
    setCodeColorScheme,
    hideMenuLabels,
    logout,
    uploadUserPicture,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Settings))