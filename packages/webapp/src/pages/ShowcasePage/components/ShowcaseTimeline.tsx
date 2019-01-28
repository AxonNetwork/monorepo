import React from 'react'
import { connect } from 'react-redux'
import TimelineEvent from 'conscience-components/TimelineEvent'
import { IGlobalState } from 'conscience-components/redux'
import { IOrganization, ITimelineEvent, IRepo, IUser, URI, URIType } from 'conscience-lib/common'
import { mergeTimelines } from 'conscience-lib/utils'


class ShowcaseTimeline extends React.Component<Props>
{

    render() {
        const commitList = mergeTimelines(this.props.orgRepoIDs, this.props.commitListsByURI, this.props.commits)

        return (
            <div>
                {commitList.map(hash => {
                    const event = this.props.commits[hash]
                    const uri = { type: URIType.Network, repoID: event.repoID || '', commit: event.commit } as URI
                    return (
                        <TimelineEvent uri={uri} />
                    )
                })}
            </div>
        )
    }
}

type Props = OwnProps & StateProps

interface OwnProps {
    orgID: string
}

interface StateProps {
    orgRepoIDs: string[]
    commitListsByURI: { [uri: string]: string[] }
    commits: { [commitHash: string]: ITimelineEvent }
}

const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const orgRepoIDs = (state.org.orgs[ownProps.orgID] || {}).repos || []
    const { commitListsByURI, commits } = state.repo

    return {
        orgRepoIDs,
        commitListsByURI,
        commits,
    }
}

export default connect(mapStateToProps, null)(ShowcaseTimeline)
