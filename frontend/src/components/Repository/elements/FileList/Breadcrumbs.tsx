import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import path from 'path'
import autobind from '../../../../utils/autobind'

@autobind
class Breadcrumbs extends React.Component<Props>
{
    state = {
        showBasePath: false,
    }

    componentWillReceiveProps(props: Props) {
        if (props.folderPath !== this.props.folderPath) {
            this.setState({ showBasePath: false })
        }
    }

    showBasePath() {
        this.setState({ showBasePath: true })
    }

    selectCrumb(index: number) {
        const parts = this.getParts(this.props.folderPath, this.props.selectedFolder)
        const dir = path.dirname(this.props.folderPath)
        const toSelect = parts.slice(0, index + 1).join('/')
        this.props.selectFile({ file: path.join(dir, toSelect), isFolder: true })
    }

    getParts(folderPath: string, selectedFolder: string|undefined) {
        const basePath = path.dirname(folderPath)
        let parts = [ path.basename(folderPath) ]
        if (selectedFolder !== undefined) {
            parts = selectedFolder.replace(basePath + '/', '').split('/')
        }
        return parts
    }

    render() {
        const { folderPath, selectedFolder, classes } = this.props
        if (folderPath === undefined) {
            return null
        }

        const basePath = path.dirname(folderPath)
        const parts = this.getParts(folderPath, selectedFolder)

        return (
            <Typography>
                <span>Location: </span>
                {!this.state.showBasePath &&
                    <span className={classes.crumb} onClick={this.showBasePath}>...</span>
                }
                {this.state.showBasePath &&
                    <span>{basePath.substring(1).split('/').join(' / ')}</span>
                }
                <span> / </span>
                {parts.map((p, i) => {
                    return(
                        <React.Fragment key={p + i}>
                            <span className={classes.crumb} onClick={() => this.selectCrumb(i)}>
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
    folderPath: string
    selectedFolder: string|undefined
    selectFile: Function
    classes: {
        crumb: string
    }
}

const styles = (theme: Theme) => createStyles({
    crumb: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
    },
})

export default withStyles(styles)(Breadcrumbs)
