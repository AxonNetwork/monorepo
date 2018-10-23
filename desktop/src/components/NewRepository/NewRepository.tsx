import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { pickBy } from 'lodash'

import SharedRepos from './elements/SharedRepos'
import { IGlobalState } from 'redux/store'
import { createRepo } from 'redux/repository/repoActions'
import { cloneSharedRepo } from 'redux/user/userActions'
import { IOrganization, ISharedRepoInfo } from 'common'
import autobind from 'utils/autobind'

@autobind
class NewRepository extends React.Component<Props, State>
{
    _inputRepoID : HTMLInputElement | null = null

    state = {
        orgID: ''
    }

    componentWillMount(){
        this.setState({
            orgID: this.props.selectedOrg
        })
    }

    handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>){
        this.setState({
            orgID: event.target.value
        })
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(this._inputRepoID === null){
            return
        }
        const repoID = this._inputRepoID.value
        const orgID = this.state.orgID
        this.props.createRepo({ repoID, orgID })
    }

    render() {
        const { orgs, classes } = this.props
        return (
            <Grid container spacing={24}>
                <Grid item className={classes.column} xs={12} sm={6}>
                    <Typography variant="headline">
                        Create new repository
                    </Typography>
                    <form noValidate autoComplete="off" name="create" onSubmit={this.handleSubmit}>
                        <TextField
                            id="repo-id"
                            label="Repository ID"
                            fullWidth
                            inputRef={x => this._inputRepoID = x}
                        />
                        <FormControl className={classes.selectContainer}>
                            <InputLabel>
                                Organization
                            </InputLabel>
                            <Select
                                value={this.state.orgID}
                                onChange={this.handleSelectChange}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {Object.keys(orgs).map((id: string) => (
                                    <MenuItem value={id}>{orgs[id].name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                </Grid>
                <Grid item className={classes.column} xs={12} sm={6}>
                    <SharedRepos
                        sharedRepos={this.props.sharedRepos}
                        cloneSharedRepo={this.props.cloneSharedRepo}
                    />
                </Grid>
            </Grid>
        )
    }
}

interface Props {
    sharedRepos: {[repoID: string]: ISharedRepoInfo}
    orgs: {[orgID: string]: IOrganization}
    selectedOrg: string
    createRepoLoading: boolean
    createRepo: typeof createRepo
    cloneSharedRepo: typeof cloneSharedRepo
    classes: any
}

interface State {
    orgID: string
}

const styles = (theme: Theme) => createStyles({
    button: {
        display: 'block',
        textTransform: 'none',
        marginTop: 16,
    },
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    selectContainer:{
        width: '100%',
        marginTop: 16
    }
})

const mapStateToProps = (state: IGlobalState) => {
    const sharedRepos = state.user.sharedRepos || {}
    const repos = state.repository.repos
    const repoList = Object.keys(repos).map(r => repos[r].repoID)
    const filteredSharedRepos = pickBy(
        sharedRepos,
        r => repoList.indexOf(r.repoID) < 0,
    )
    const orgs = state.org.orgs
    const selectedOrg = state.org.selectedOrg || ""
    const createRepoLoading = state.ui.createRepoLoading
    return {
        sharedRepos: filteredSharedRepos,
        orgs,
        selectedOrg,
        createRepoLoading,
    }
}

const mapDispatchToProps = {
    createRepo,
    cloneSharedRepo,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(NewRepository))