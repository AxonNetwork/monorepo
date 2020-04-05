import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import ErrorSnackbar from 'conscience-components/ErrorSnackbar'
import { H3 } from 'conscience-components/Typography/Headers'
import { initRepo } from 'conscience-components/redux/repo/repoActions'
import { clearInitRepoError } from 'conscience-components/redux/ui/uiActions'
import { IGlobalState } from 'conscience-components/redux'
import { autobind } from 'conscience-lib/utils'
import logo from '../../assets/img/logo.png'


@autobind
class WelcomePage extends React.Component<Props>
{
    _inputRepoID: HTMLInputElement | null = null

    render() {
        const { classes } = this.props
        return (
            <div className={classes.welcomePage}>
                <img src={logo} alt="Axon Logo" className={classes.logo} />

                <H3>Welcome to Axon</H3>

                <br />
                <form noValidate autoComplete="off" name="create" onSubmit={this.handleSubmit} className={classes.form}>
                    <Typography variant="subtitle1">
                        <strong>Get started by creating a repository.</strong>
                    </Typography>
                        <Typography variant="subtitle1">
                        <span style={{ fontSize: '2rem' }}>🗂</span> A repository is a collection of files and discussions associated with a project.  Don't worry, you can choose anything for now as you explore the app.
                    </Typography>
                    <br />
                    <br />
                    <TextField
                        id="repo-id"
                        label="Repository name"
                        fullWidth
                        inputRef={x => this._inputRepoID = x}
                        autoFocus
                    />
                    <Button
                        variant="raised"
                        color="secondary"
                        className={classes.button}
                        disabled={this.props.createRepoLoading}
                        type="submit"
                    >
                        Create
                        {this.props.createRepoLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
                    </Button>
                </form>

                <ErrorSnackbar
                    open={this.props.initRepoError !== undefined}
                    onClose={this.closeError}
                    message={(this.props.initRepoError || { message: '' }).message}
                />
            </div>
        )
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (this._inputRepoID === null) {
            return
        }
        const repoID = this._inputRepoID.value
        const orgID = ""
        this.props.initRepo({ repoID, orgID })
    }

    closeError() {
        this.props.clearInitRepoError({})
    }
}

interface Props {
    createRepoLoading: boolean
    initRepoError: Error | undefined
    initRepo: typeof initRepo
    clearInitRepoError: typeof clearInitRepoError
    classes: any
}

const styles = (theme: Theme) => createStyles({
    welcomePage: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        width: '100%',
        height: '100%',
        paddingTop: 150,
    },
    logo: {
        width: 128
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '35%',
        minWidth: 350,
        marginTop: 32,
    },
    button: {
        display: 'block',
        textTransform: 'none',
        marginTop: 32,
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
    return {
        createRepoLoading: state.ui.createRepoLoading,
        initRepoError: state.ui.initRepoError,
    }
}

const mapDispatchToProps = {
    initRepo,
    clearInitRepoError,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(WelcomePage))