import React from 'react'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import DiscussionsPane from 'conscience-components/DiscussionsPane'
import { URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoDiscussionPage extends React.Component<Props>
{
    render() {
        const { discussionID, repoID } = this.props.match.params
        const { classes } = this.props

        return (
            <div className={classes.page}>
                <DiscussionsPane
                    uri={{ type: URIType.Network, repoID }}
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
