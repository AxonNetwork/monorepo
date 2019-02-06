import fs from 'fs'
import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import { IGlobalState } from 'conscience-components/redux'
import FileEditor from 'conscience-components/FileEditor'
import Breadcrumbs from 'conscience-components/Breadcrumbs'
import { LocalURI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoEditorPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        return (
            <div className={classes.page}>
                <Breadcrumbs uri={this.props.uri} />

                <FileEditor
                    uri={this.props.uri}
                    showButtons
                    showEditorPicker
                />
            </div>
        )
    }
}


type Props = StateProps & DispatchProps & OwnProps & { classes: any }

interface MatchParams {
    filename: string
    repoHash: string
}

interface OwnProps extends RouteComponentProps<MatchParams> { }

interface StateProps {
    uri: LocalURI
}

interface DispatchProps { }

const styles = (theme: Theme) => createStyles({
    page: {
        marginTop: 32
    },
})

const mapStateToProps = (state: IGlobalState, props: OwnProps) => {
    const repoRoot = state.repo.reposByHash[props.match.params.repoHash]
    const filename = props.match.params.filename
    const uri = { type: URIType.Local, repoRoot, commit: 'working', filename } as LocalURI
    return {
        uri,
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoEditorPage))
