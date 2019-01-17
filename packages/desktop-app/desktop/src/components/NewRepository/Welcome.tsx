import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import logo from '../../assets/img/logo.png'
import { IGlobalState } from 'redux/store'
import { createRepo } from 'redux/repo/repoActions'
import autobind from 'utils/autobind'

@autobind
class NewRepository extends React.Component<Props>
{
    _inputRepoID: HTMLInputElement | null = null

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (this._inputRepoID === null) {
            return
        }
        const repoID = this._inputRepoID.value
        const orgID = ""
        this.props.createRepo({ repoID, orgID })
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.welcomePage}>
                <img src={logo} alt="Conscience Logo" className={classes.logo} />
                <Typography variant="h3">
                    Welcome to Conscience
                </Typography>
                <form noValidate autoComplete="off" name="create" onSubmit={this.handleSubmit} className={classes.form}>
                    <Typography variant="subtitle1">
                        Get started by creating your first repository:
                    </Typography>
                    <TextField
                        id="repo-id"
                        label="Repository ID"
                        fullWidth
                        inputRef={x => this._inputRepoID = x}
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
            </div>
        )
    }
}

interface Props {
    createRepoLoading: boolean
    createRepo: typeof createRepo
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
    const createRepoLoading = state.ui.createRepoLoading
    return {
        createRepoLoading
    }
}

const mapDispatchToProps = {
    createRepo,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(NewRepository))