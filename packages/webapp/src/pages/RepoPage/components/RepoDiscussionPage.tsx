import React from 'react'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import DiscussionPane from 'conscience-components/DiscussionPane'
import { URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoDiscussionPage extends React.Component<Props>
{
    render() {
        const { discussionID, repoID } = this.props.match.params
        const { classes } = this.props

        const uri = { type: URIType.Network, repoID } as URI
        return (
            <div className={classes.page}>
                <DiscussionPane
                    uri={uri}
                    selectedID={discussionID}
                />
            </div>
        )
    }
}

interface MatchParams {
    repoID: string
    discussionID: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 16,
    },
})

export default withStyles(styles)(RepoDiscussionPage)
