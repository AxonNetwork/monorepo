import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import MergeConflictResolver from 'conscience-components/MergeConflictResolver'
import { IGlobalState } from 'conscience-components/redux'
import { LocalURI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoConflictPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        return (
            <div className={classes.page}>
                <MergeConflictResolver uri={this.props.uri} />
            </div>
        )
    }
}

interface MatchParams {
    repoHash: string
    filename: string
}

interface Props extends RouteComponentProps<MatchParams> {
    uri: LocalURI
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const repoRoot = state.repo.reposByHash[props.match.params.repoHash]
    const filename = props.match.params.filename
    const uri = { type: URIType.Local, repoRoot, filename } as LocalURI
    return {
        uri
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoConflictPage))
