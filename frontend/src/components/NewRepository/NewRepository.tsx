import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { omitBy } from 'lodash'

import SharedRepos from './elements/SharedRepos'
import { IGlobalState } from 'redux/store'
import { createRepo} from 'redux/repository/repoActions'
import { cloneSharedRepo } from 'redux/user/userActions'
import { ISharedRepoInfo } from 'common'
import autobind from 'utils/autobind'

@autobind
class NewRepository extends React.Component<Props, State>
{
    state = {
        repoID: '',
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({ repoID: event.target.value })
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        this.props.createRepo({repoID: this.state.repoID})
    }

    render() {
        const classes = this.props.classes

        return (
            <Grid container spacing={24}>
                <Grid item className={classes.column} xs={12} sm={6}>
                    <Typography variant="headline">
                        Create New Repository
                    </Typography>
                    <form noValidate autoComplete="off" name="create" onSubmit={this.handleSubmit}>
                        <TextField
                            id="repo-name"
                            label="Repository ID"
                            value={this.state.repoID}
                            onChange={this.handleChange}
                        />
                        <Button variant="raised" color="secondary" className={classes.button} type="submit">
                            Create
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
    createRepo: Function
    sharedRepos: {[repoID: string]: ISharedRepoInfo}
    cloneSharedRepo: typeof cloneSharedRepo
    classes: any
}

interface State {
    repoID: string
}

const styles = createStyles({
    button: {
        display: 'block',
        textTransform: 'none',
        marginTop: '16px',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    const sharedRepos = state.user.sharedRepos || {}
    const repos = state.repository.repos
    const repoList = Object.keys(repos).map(r => repos[r].repoID)
    const filteredSharedRepos = omitBy(
        sharedRepos,
        r => repoList.indexOf(r.repoID)<0
    )
    return {
        sharedRepos: filteredSharedRepos,
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