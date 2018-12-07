import React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import autobind from 'utils/autobind'


@autobind
class Description extends React.Component<Props, State>
{
    state = {
        showInput: false
    }

    _inputDescription: HTMLInputElement | null = null

    render(){
        const { description, classes } = this.props
        return(
            <div className={classes.root}>
                {!this.state.showInput &&
                    <Typography className={classes.description}>
                        {description.length > 0 ? description : "Add Description"}
                    </Typography>
                }
                {this.state.showInput &&
                    <TextField
                        multiline
                        defaultValue={description}
                        placeholder="Add Description"
                    />
                }
                <IconButton onClick={this.toggleInput}>
                    <EditIcon fontSize="small" />
                </IconButton>
            </div>
        )
    }

    toggleInput(){
        this.setState({ showInput: !this.state.showInput })
    }

    onClickChangeOrgDescription(){

    }
}

interface Props {
    orgID: string
    description: string
    changeOrgDescription: Function
    classes: any
}

interface State {
    showInput: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex'
    },
    description: {
        fontStyle: 'italic',
        marginBottom: theme.spacing.unit,
        fontSize: '12pt'
    }
})

export default withStyles(styles)(Description)