import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

import SharedRepos from './elements/SharedRepos'

class NewRepository extends Component {

    constructor(props) {
        super(props)
        this.state = {
            repoName: '',
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    handleSubmit(event) {
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
                            onChange={this.handleChange('repoName')}
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

NewRepository.propTypes = {
    createRepo: PropTypes.func.isRequired,
    sharedRepos: PropTypes.array.isRequired,
    addSharedRepo: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    button: {
        display: 'block',
        textTransform: 'none',
        marginTop: '16px'
    }
})

export default withStyles(styles)(NewRepository)
