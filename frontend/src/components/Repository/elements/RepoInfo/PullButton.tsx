import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import GetAppIcon from '@material-ui/icons/GetApp'

export interface PullButtonProps {
    pullRepo: Function
    folderPath: string
    repoID: string
    classes: {
        button: string
        icon: string
    }
}

// function PullButton extends React.Component<PullButtonProps>
function PullButton(props: PullButtonProps) {
    const { pullRepo, folderPath, repoID, classes } = props

    return (
        <Button
            variant="contained"
            size="small"
            color="secondary"
            className={classes.button}
            onClick={() => pullRepo(folderPath, repoID)}
        >
            Pull
            <GetAppIcon className={classes.icon} />
        </Button>
    )
}

const styles = (theme: Theme) => createStyles({
    button: {
        marginTop: theme.spacing.unit,
        textTransform: 'none',
    },
    icon: {
        fontSize: '14pt',
        marginLeft: theme.spacing.unit,
    },
})

export default withStyles(styles)(PullButton)
