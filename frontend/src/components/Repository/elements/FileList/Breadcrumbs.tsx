import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import path from 'path'
import autobind from '../../../../utils/autobind'

export interface BreadcrumbsProps {
    folderPath: string
    selectedFolder: string|undefined
    selectFile: Function
    classes:{
        crumb: string
    }
}

@autobind
class Breadcrumbs extends React.Component<BreadcrumbsProps>
{

    state ={
        showBasePath: false
    }

    componentWillReceiveProps(props: BreadcrumbsProps) {
        if (props.folderPath !== this.props.folderPath) {
            this.setState({showBasePath: false})
        }
    }

    showBasePath(){
        this.setState({showBasePath: true})
    }

    selectCrumb(index: number){
        const parts = this.getParts(this.props.folderPath, this.props.selectedFolder)
        const dir = path.dirname(this.props.folderPath)
        const toSelect = parts.slice(0, index + 1).join('/')
        this.props.selectFile({file: path.join(dir, toSelect), isFolder: true})
    }

    getParts(folderPath: string, selectedFolder: string|undefined){
        const basePath = path.dirname(folderPath)
        let parts = [path.basename(folderPath)]
        if (selectedFolder !== undefined) {
            const selected = selectedFolder.replace(basePath + '/', '')
            parts = selected.split('/')
        }
        return parts
    }

    render() {
        const { folderPath, selectedFolder, classes } = this.props
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

const styles = (theme: Theme) => createStyles({
    crumb: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
    },
})

export default withStyles(styles)(Breadcrumbs)
