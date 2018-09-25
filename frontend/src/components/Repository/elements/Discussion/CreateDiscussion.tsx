import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import FormHelperText from '@material-ui/core/FormHelperText'
import CancelIcon from '@material-ui/icons/Cancel'

class CreateDiscussion extends Component {

    constructor(props) {
        super(props)
        this.state={
            error: undefined,
            subject: "",
            comment: ""
        }
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        const valid = this.state.comment.length > 0 && this.state.subject.length > 0
        this.setState({error: "Oops! You need both a subject and a comment."})
        if(valid){
            this.setState({
                subject:"",
                comment: "",
                error: undefined
            })
            this.props.createDiscussion(this.props.repoID, this.state.subject, this.state.comment)
        }
    }

    render() {
        const classes = this.props.classes

        return (
            <React.Fragment>
                <IconButton onClick={this.props.unselect} className={classes.cancel} size="small">
                    <CancelIcon />
                </IconButton>
                <Typography variant="title" className={classes.title}>Start a New Discussion</Typography>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                    <TextField
                        id="subject"
                        label="Subject"
                        value={this.state.subject}
                        className={classes.textField}
                        fullWidth
                        onChange={this.handleChange('subject')}
                    />
                    <TextField
                        id="comment"
                        label="Comment"
                        value={this.state.comment}
                        className={classes.textField}
                        fullWidth
                        multiline
                        rows={3}
                        onChange={this.handleChange('comment')}
                    />
                    <Button color="secondary" variant="contained" type="submit">
                        Create
                    </Button>
                    <FormHelperText error className={classes.error}>{this.state.error}</FormHelperText>
                </form>
            </React.Fragment>
        )
    }
}

CreateDiscussion.propTypes = {
    repoID: PropTypes.string.isRequired,
    createDiscussion: PropTypes.func.isRequired,
    unselect: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    cancel:{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: theme.spacing.unit
    },
    title:{
        backgroundColor: theme.palette.grey[300],
        padding: theme.spacing.unit
    },
    form:{
        width: '100%',
        padding: theme.spacing.unit
    },
    textField:{
        display: 'block',
        marginBottom: theme.spacing.unit
    },
    error: {

    }
})

export default withStyles(styles)(CreateDiscussion)
