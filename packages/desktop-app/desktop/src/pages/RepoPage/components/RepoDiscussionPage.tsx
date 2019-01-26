import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import DiscussionPane from 'conscience-components/DiscussionPane'
import { IGlobalState } from 'conscience-components/redux'
import { getURIFromParams } from 'conscience-components/env-specific'
import { URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoDiscussionPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        if (!this.props.uri) return null

        return (
            <div className={classes.page}>
                <DiscussionPane
                    uri={this.props.uri}
                    selectedID={this.props.match.params.discussionID}
                />
            </div>
        )
    }
}

interface MatchParams {
    repoHash: string
    discussionID: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
    uri?: URI
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 16,
        width: '100%',
        height: '100%',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: Props) => {
    const uri = getURIFromParams(ownProps.match.params)
    return {
        uri,
    }
}

const mapDispatchToProps = {}

const RepoDiscussionPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoDiscussionPage))

export default RepoDiscussionPageContainer
