import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import TimelineEvent from 'conscience-components/TimelineEvent'
import { IOrganization, IRepo, IUser, } from 'conscience-lib/common'
import { collateTimelines, removeEmail, extractEmail } from 'conscience-lib/utils'


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
                    const email = extractEmail(event.user) || ''
                    const user = this.props.users[this.props.usersByEmail[email] || ''] || {}
                    const username = user.name || removeEmail(event.user)
                    const userPicture = user.picture
                    return (
                        <TimelineEvent
                            key={event.commit}
                            event={event}
                            username={username}
                            userPicture={userPicture}
                            selectCommit={this.props.selectCommit}
                        />
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
