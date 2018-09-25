import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import ButtonBase from '@material-ui/core/ButtonBase'
import SendIcon from '@material-ui/icons/Send'
import CancelIcon from '@material-ui/icons/Cancel'
import moment from 'moment'

import { createComment } from '../../../../redux/discussion/discussionActions'

class Thread extends Component {

    constructor(props) {
        super(props)
        this.state={
            comment:""
        }
    }

    handleKeyPress = event => {
        if (event.key === 'Enter' && event.shiftKey) {
            this.handleSubmit(event)
        }
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        })
    }

    handleSubmit = event => {
        event.preventDefault()
        if(this.state.comment.length === 0){
            return
        }
        this.props.createComment(
            this.props.repoID,
            this.state.comment,
            {type:this.props.type, subject:this.props.subject},
            this.props.user
        )

        this.setState({comment: ""})
    }

    render() {
        const {classes, title, comments} = this.props

        return (
            <div className={classes.threadContainer}>
                {this.props.unselect !== undefined &&
                    <IconButton onClick={this.props.unselect} className={classes.cancel} size="small">
                        <CancelIcon />
                    </IconButton>
                }
                <Typography variant="title" className={classes.title}>{title}</Typography>
                <div className={classes.thread}>
                    <div className={classes.comments}>
                        {comments.length === 0 &&
                            <Typography className={classes.comment}>No comments yet. Start the discussion!</Typography>
                        }
                        {comments.map(c=>{
                            return (
                                <div className={classes.comment} key={c.created}>
                                    <Typography><strong>{c.name||c.user}</strong> <small>({moment(c.created).fromNow()})</small></Typography>
                                    {c.text.split("\n").map((p, i)=>(
                                        <Typography className={classes.text} key={i}>{p}</Typography>
                                    ))}
                                </div>
                            )
                        })}
                    </div>
                    <form onSubmit={this.handleSubmit} className={classes.reply}>
                        <TextField
                            id="comment"
                            value={this.state.comment}
                            placeholder="Comment (Shift + Enter to send)"
                            multiline
                            rows={2}
                            rowsMax={8}
                            onChange={this.handleChange('comment')}
                            onKeyUp={this.handleKeyPress}
                            className={classes.textField}
                        />
                        <ButtonBase type='submit' className={classes.submit}>
                            <SendIcon className={classes.icon}/>
                        </ButtonBase>
                    </form>
                </div>
            </div>
        )
    }
}

Thread.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    subject: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    unselect: PropTypes.func,

    repoID: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    user: PropTypes.string.isRequired,
    createComment: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    threadContainer:{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    },
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
    thread:{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    comments:{
        overflow: 'scroll',
        flexGrow: 1
    },
    comment:{
        margin: theme.spacing.unit
    },
    text:{
        paddingBottom: theme.spacing.unit*0.25,
        marginLeft: theme.spacing.unit,
        paddingLeft: theme.spacing.unit*0.5,
        borderLeft: '2px solid',
        borderColor: theme.palette.grey[400]
    },
    reply:{
        display: 'flex',
        alignSelf: 'flex-end',
        width: '100%',
        borderTop: '1px solid',
        borderColor: theme.palette.grey[300]
    },
    textField:{
        flexGrow: 1,
        padding: theme.spacing.unit
    },
    submit:{
        padding: theme.spacing.unit,
        borderRadius: 4,
    },
    icon:{
        color: theme.palette.grey[700]
    }
})


const mapStateToProps = (state, ownProps) => {
    const repoID = state.repository.repos[state.repository.selectedRepo].repoID
    const comments = state.discussion.comments.filter(c=>c.attachedTo.subject === ownProps.subject)
    return {
        repoID: repoID,
        comments: comments,
        user: state.user.name
    }
}

const mapDispatchToProps = {
    createComment,
}

const ThreadContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Thread))

export default ThreadContainer