import React from 'react'
import path from 'path'
import classnames from 'classnames'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { FileMode } from 'conscience-lib/common'
import autobind from 'conscience-lib/utils/autobind'

@autobind
class Breadcrumbs extends React.Component<Props>
{
    state = {
        showBasePath: false,
    }

    componentWillReceiveProps(props: Props) {
        if (props.repoRoot !== this.props.repoRoot) {
            this.setState({ showBasePath: false })
        }
    }

    showBasePath() {
        this.setState({ showBasePath: true })
    }

    selectCrumb(index: number) {
        if (index === 0) {
            this.props.selectFile({ selectedFile: undefined })
            return
        }

        const { repoRoot, selectedFolder } = this.props
        const parts = this.getParts(repoRoot, selectedFolder)
        this.props.selectFile({ selectedFile: { file: parts.slice(1, index + 1).join('/'), isFolder: true, mode: FileMode.View } })
    }

    getParts(repoRoot: string, selectedFolder: string | undefined) {
        let parts = [ path.basename(repoRoot) ]
        if (selectedFolder !== undefined) {
            parts = parts.concat(selectedFolder.split('/'))
        }
        return parts
    }

    render() {
        const { repoRoot, selectedFolder, classes } = this.props
        if (repoRoot === undefined) {
            return null
        }

        const basePath = path.dirname(repoRoot)
        const parts = this.getParts(repoRoot, selectedFolder)

        return (
            <Typography className={classes.root}>
                <span>Location: </span>
                {!this.state.showBasePath &&
                    <span className={classes.crumb} onClick={this.showBasePath}>...</span>
                }
                {this.state.showBasePath &&
                    <span>{basePath.substring(1).split('/').join(' / ')}</span>
                }
                <span> / </span>
                {parts.map((p, i) => {
                    return (
                        <React.Fragment key={p + i}>
                            <span className={classnames({ [classes.crumb]: i < parts.length - 1 })} onClick={() => this.selectCrumb(i)}>
                                {p}
                            </span>
                            {(i < parts.length - 1) &&
                                <span> / </span>
                            }
                        </React.Fragment>
                    )
                })}
            </Typography>
        )
    }
}

interface Props {
    repoRoot: string
    selectedFolder: string | undefined
    selectFile: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {},
    crumb: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
})

export default withStyles(styles)(Breadcrumbs)

