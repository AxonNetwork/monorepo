import React from 'react'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'


class LargeAddButton extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                <div className={classes.contents} onClick={this.props.onClick}>
                    <Typography className={classes.text}>
                        Click to add a welcome message for your team
                    </Typography>

                    <AddCircleOutlineIcon className={classes.icon} />
                </div>
            </div>
        )
    }
}

interface Props {
    text: string
    onClick: () => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        border: '3px solid #c5c5c5',
        padding: 30,
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: theme.spacing.unit * 3,
    },
    contents: {
        position: 'relative',
        top: '15%',
    },
    text: {
        fontSize: '1.2rem',
        color: '#a2a2a2',
        fontWeight: 700,
        marginBottom: 20,
    },
    icon: {
        fontSize: '5rem',
        color: '#a2a2a2',
    },
})

export default withStyles(styles)(LargeAddButton)