import React from 'react'
import { connect } from 'react-redux'
import { History } from 'history'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import SecuredText from 'conscience-components/SecuredText'
import { IGlobalState } from 'redux/store'
import { ITimelineEvent } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class ConnectedSecuredText extends React.Component<Props>
{
    render() {
        return (
            <SecuredText
                commits={this.props.commits}
                commitList={this.props.commitList}
                commit={this.props.commit}
                filename={this.props.filename}
                selectCommit={this.selectCommit}
            />
        )
    }

    selectCommit(payload: { selectedCommit: string | undefined }) {
        const repoID = this.props.repoID
        const commit = payload.selectedCommit
        if (commit === undefined) {
            this.props.history.push(`/repo/${repoID}`)
        } else {
            this.props.history.push(`/repo/${repoID}/history/${commit}`)
        }
    }
}


type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    repoID: string
    commit?: string
    filename?: string
    lastUpdated?: Date
    history: History
}

interface StateProps {
    commits: { [commitHash: string]: ITimelineEvent }
    commitList: string[]
}

const styles = (theme: Theme) => createStyles({
    progressContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 256,
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const repo = state.repo.repos[ownProps.repoID]
    return {
        commits: repo.commits || {},
        commitList: repo.commitList || [],
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(ConnectedSecuredText))
