import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import MergeConflictResolver from 'conscience-components/MergeConflictResolver'
import { IGlobalState } from 'redux/store'
import { FileMode } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoEditorPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        return (
            <div className={classes.page}>
                <MergeConflictResolver
                    repoRoot={this.props.repoRoot}
                    filename={this.props.match.params.filename}
                    codeColorScheme={this.props.codeColorScheme}
                    selectFile={this.selectFile}
                />
            </div>
        )
    }

    selectFile(payload: { filename: string | undefined, mode: FileMode }) {
        const repoHash = this.props.match.params.repoHash
        const { filename, mode } = payload
        if (filename === undefined) {
            this.props.history.push(`/repo/${repoHash}/files`)
        } else if (mode === FileMode.Edit) {
            this.props.history.push(`/repo/${repoHash}/edit/${filename}`)
        } else if (mode === FileMode.ResolveConflict) {
            this.props.history.push(`/repo/${repoHash}/conflict/${filename}`)
        } else {
            this.props.history.push(`/repo/${repoHash}/files/${filename}`)
        }
    }
}

interface MatchParams {
    repoHash: string
    filename: string
}

interface Props extends RouteComponentProps<MatchParams> {
    repoRoot: string
    codeColorScheme?: string | undefined
    classes: any
}

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    const repoRoot = state.repo.reposByHash[props.match.params.repoHash]
    return {
        repoRoot,
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoEditorPage))
