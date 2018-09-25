import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

class Hypothesis extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            hypothesis: props.hypothesis || ''
        }
    }

    handleClickOpen = () =>{
        this.setState({
            show: true
        })
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.addHypothesis(this.props.folderPath, this.state.hypothesis)
        this.setState({
            show: false
        })
    }

    render() {
        const classes = this.props.classes
        if(this.props.hypothesis !== undefined && !this.state.show){
            return(
                <Typography className={classes.text}>
                    Hypothesis: {this.props.hypothesis}
                    <IconButton className={classes.openButton} onClick={this.handleClickOpen} >
                        <EditIcon className={classes.icon} />
                    </IconButton>
                </Typography>
            )
        }
        if(!this.state.show){
            return (
                <Typography className={classes.text}>
                    Hypothesis:
                    <IconButton className={classes.openButton} onClick={this.handleClickOpen} >
                        <ControlPointIcon className={classes.icon} />
                    </IconButton>
                </Typography>
            )
        }
        return (
            <React.Fragment>
                <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                    <Grid container>
                        <Grid item xs={9}>
                            <TextField
                                id="hypothesis"
                                label="Hypothesis"
                                value={this.state.hypothesis}
                                onChange={this.handleChange('hypothesis')}
                                className={classes.textField}
                                autoFocus={true}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Button size="small" variant="raised" color="secondary" className={classes.submitButton} type="submit">
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </React.Fragment>
        )
    }
}

Hypothesis.propTypes = {
    hypothesis: PropTypes.string,
    folderPath: PropTypes.string.isRequired,
    addHypothesis: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    text:{
        marginTop: '12px'
    },
    openButton:{
        width: '24px',
        height: '24px'
    },
    icon:{
        fontSize: '14pt'
    },
    textField: {
        width: '100%'
    },
    submitButton: {
        display: 'block',
        textTransform: 'none',
        marginTop: '8px',
        marginLeft: '16px'
    }
})

export default withStyles(styles)(Hypothesis)
