import React from 'react'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import AccessControlList from 'conscience-components/AccessControlList'
import { URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoTeamPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        const repoID = this.props.match.params.repoID
        const uri = { type: URIType.Network, repoID } as URI

        return (
            <div className={classes.page}>
                <AccessControlList uri={uri} />
            </div>
        )
    }

    selectUser(payload: { username: string }) {
        const username = payload.username
        if (username === undefined) {
            return
        }
        this.props.history.push(`/user/${username}`)
    }
}

interface MatchParams {
    repoID: string
}

interface Props extends RouteComponentProps<MatchParams> {
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

export default withStyles(styles)(RepoTeamPage)
