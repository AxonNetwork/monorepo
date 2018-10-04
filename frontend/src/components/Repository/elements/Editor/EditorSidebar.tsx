import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import CancelIcon from '@material-ui/icons/Cancel'
import autobind from 'utils/autobind'

@autobind
class EditorSidebar extends React.Component<Props>
{
    handleInsert(option: string){
        this.props.onInsert(option)
    }

    render(){
        const { type, options, classes } = this.props
        if(options.length === 0){
            return null
        }
        return(
            <div className={classes.sidebar}>
                    <IconButton
                        onClick={this.props.onClose as any}
                        className={classes.cancel}
                    >
                        <CancelIcon />
                    </IconButton>

                <Typography variant="title" className={classes.title}>
                    {type}
                </Typography>
                <List>
                    {options.map((option: string) => (
                        <React.Fragment>
                            <ListItem
                                button
                                onClick={()=>this.handleInsert(option)}
                                key={option}
                            >
                                <ListItemText primary={option} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </div>
        )
    }
}

interface Props {
    type: string
    options: string[]
    onInsert: Function
    onClose: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    cancel:{
        position:'absolute',
        top: 0,
        right: 0
    },
    sidebar:{
        position: 'relative',
        minWidth: 200,
        maxWidth: 400,
        width: '30%',
        height: '100%',
        border: '1px solid #ccc'
    },
    title:{
        textAlign: 'center',
        marginTop: theme.spacing.unit*1.5
    }
})

export default withStyles(styles)(EditorSidebar)