import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import GetAppIcon from '@material-ui/icons/GetApp'

function PullButton(props: Props) {
    const { pullRepo, folderPath, repoID, pullLoading, classes } = props

    return (
        <Button
            variant="contained"
            size="small"
            color="secondary"
            className={classes.button}
            disabled={pullLoading}
            onClick={() => pullRepo({folderPath, repoID})}
        >
            Pull
            <GetAppIcon className={classes.icon} />
            {pullLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
        </Button>
    )
}

export interface Props {
    pullRepo: Function
    folderPath: string
    repoID: string
    pullLoading: boolean
    classes:any
}

const styles = (theme: Theme) => createStyles({
    button: {
        marginTop: -1 * theme.spacing.unit,
        marginLeft: 4 * theme.spacing.unit,
        textTransform: 'none',
    },
    icon: {
        fontSize: '14pt',
        marginLeft: theme.spacing.unit,
    },
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

export default withStyles(styles)(PullButton)
