import React from 'react'
import { connect } from 'react-redux'
import TimelineEvent from 'conscience-components/TimelineEvent'
import { IGlobalState } from 'conscience-components/redux'
import { ITimelineEvent, URI, URIType } from 'conscience-lib/common'


class ShowcaseTimeline extends React.Component<Props>
{

    render() {
        const { timeline, commits } = this.props
        if (!timeline) {
            return null
        }
        const uriList = timeline.map(commit => {
            return {
                type: URIType.Network,
                repoID: (commits[commit] || {}).repoID,
                commit: commit,
            } as URI
        })

        return (
            <div>
                {uriList.map(uri => {
                    return (
                        <TimelineEvent uri={uri} showRepoID />
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
    timeline: string[]
    commits: { [commitHash: string]: ITimelineEvent }
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const orgID = ownProps.orgID

    return {
        timeline: state.org.showcaseTimelines[orgID],
        commits: state.repo.commits,
    }
}

export default connect(mapStateToProps, null)(ShowcaseTimeline)
