import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import SharedRepos from './elements/SharedRepos'
import { IGlobalState } from 'redux/store'
import { createRepo} from 'redux/repository/repoActions'
import { addSharedRepo } from 'redux/sharedRepos/sharedReposActions'
import { ISharedRepoInfo } from 'common'
import autobind from 'utils/autobind'

export interface NewRepositoryProps {
    createRepo: Function
    sharedRepos: ISharedRepoInfo[]
    addSharedRepo: Function
    classes: any
}

export interface NewRepositoryState {
    repoName: string
}

@autobind
class NewRepository extends React.Component<NewRepositoryProps, NewRepositoryState>
{
    state = {
        repoName : ''
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({
            repoName: event.target.value,
        })
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        this.props.createRepo(this.state.repoName)
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
                            label="Repository Name"
                            value={this.state.repoName}
                            onChange={this.handleChange}
                        />
                        <Button variant="raised" color="secondary" className={classes.button} type="submit">
                            Create
                        </Button>
                    </form>
                </Grid>
                <Grid item className={classes.column} xs={12} sm={6}>
                    <SharedRepos
                        sharedRepos = {this.props.sharedRepos}
                        addSharedRepo = {this.props.addSharedRepo}
                    />
                </Grid>
            </Grid>
        )
    }
}

const styles = createStyles({
    button: {
        display: 'block',
        textTransform: 'none',
        marginTop: '16px',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        sharedRepos: state.sharedRepos,
    }
}

const mapDispatchToProps = {
    createRepo,
    addSharedRepo,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(NewRepository))