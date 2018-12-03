import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import SharedUsers from './RepoSettings/SharedUsers'


class RepoSettingsPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        return (
            <div className={classes.settingsPage}>
                <SharedUsers />
            </div>
        )
    }
}

interface Props {
    classes: any
}

const styles = (_: Theme) => createStyles({
    settingsPage: {
        display: 'flex',
    },
})
export default withStyles(styles)(RepoSettingsPage)

