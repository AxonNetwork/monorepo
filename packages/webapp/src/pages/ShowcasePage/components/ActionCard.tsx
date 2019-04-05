import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'


class ActionCard extends React.Component<Props>
{
    render() {
        const { children, classes } = this.props

        return (
            <Card className={classes.card}>
                <CardActionArea
                    onClick={this.props.onClick}
                    className={classes.actionArea}
                >
                    {children}
                </CardActionArea>
            </Card>
        )

    }
}

interface Props {
    children: any
    onClick: () => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    card: {
        width: '100%',
        minHeight: 350,
        height: 'calc(100% - 32px)',
        marginBottom: 32,
        border: '2px solid ' + theme.palette.secondary.main,
    },
    actionArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        '& p': {
            fontSize: '18pt',
            color: theme.palette.secondary.main,
            marginBottom: 16
        },
        '& svg': {
            color: theme.palette.secondary.main,
            width: '2.25em',
            height: '2.25em'
        }
    },
})

export default withStyles(styles)(ActionCard)