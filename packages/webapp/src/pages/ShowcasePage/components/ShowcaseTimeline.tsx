import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import TimelineEvent from 'conscience-components/TimelineEvent'
import { IOrganization, IRepo, IUser, URI, URIType } from 'conscience-lib/common'
import { collateTimelines } from 'conscience-lib/utils'


class ShowcaseTimeline extends React.Component<Props>
{

    render() {
        const { org, repos } = this.props

        const orgRepos = org.repos.map(id => repos[id])
        const { commits, commitList } = collateTimelines(orgRepos)

        return (
            <div>
                {commitList.map(hash => {
                    const event = commits[hash]
                    const uri = { type: URIType.Network, repoID: event.repoID || '', commit: event.commit } as URI
                    return (
                        <TimelineEvent uri={uri} />
                    )
                })}
            </div>
        )
    }
}

interface Props {
    org: IOrganization
    repos: { [repoID: string]: IRepo }
    users: { [userID: string]: IUser }
    usersByEmail: { [email: string]: string }
    selectCommit: (commit: string, repoID: string | undefined) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({})

export default withStyles(styles)(ShowcaseTimeline)
