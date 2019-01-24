import fs from 'fs'
import path from 'path'
import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import MarkdownEditor from 'conscience-components/MarkdownEditor'
import { IGlobalState } from 'conscience-components/redux'
import { LocalURI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class RepoEditorPage extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        return (
            <div className={classes.page}>
                <MarkdownEditor
                    uri={this.props.uri}
                    saveFileContents={this.saveFileContents}
                />
            </div>
        )
    }

    async saveFileContents(contents: string) {
        return new Promise<string>((resolve, reject) => {
            const { repoRoot = '', filename = '' } = this.props.uri
            fs.writeFile(path.join(repoRoot, filename), contents, 'utf8', (err?: Error) => {
                if (err) {
                    reject(err)
                }
                resolve({})
            })
        })
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
    const uri = { type: URIType.Local, repoRoot, filename } as LocalURI
    return {
        uri
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(RepoEditorPage))
