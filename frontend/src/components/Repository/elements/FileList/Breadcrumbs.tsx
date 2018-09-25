import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import path from 'path'

class Breadcrumbs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showBasePath: false,
        }
    }

    componentWillReceiveProps(props) {
        if (props.folderPath !== this.props.folderPath) {
            this.setState({showBasePath: false})
        }
    }

    showBasePath = () => {
        this.setState({showBasePath: true})
    }

    selectCrumb = (index) => {
        const parts = this.getParts(this.props.folderPath, this.props.selectedFolder)
        const dir = path.dirname(this.props.folderPath)
        const toSelect = parts.slice(0, index + 1).join('/')
        this.props.selectFile(path.join(dir, toSelect), true)
    }

    getParts = (folderPath, selectedFolder) => {
        const basePath = path.dirname(folderPath)
        let parts = [path.basename(folderPath)]
        if (selectedFolder !== undefined) {
            const selected = selectedFolder.file.replace(basePath + '/', '')
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

Breadcrumbs.propTypes = {
    folderPath: PropTypes.string.isRequired,
    selectedFolder: PropTypes.string,
    selectFile: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({
    crumb: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
    },
})

export default withStyles(styles)(Breadcrumbs)
