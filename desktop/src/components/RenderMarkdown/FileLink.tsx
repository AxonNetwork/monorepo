import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import { selectFile, navigateRepoPage } from 'redux/repository/repoActions'
import { RepoPage } from 'redux/repository/repoReducer'
import autobind from 'utils/autobind'
import FileViewer from '../Repository/elements/FileViewer'

@autobind
class FileLink extends React.Component<Props, State>
{
    state = {
        showPopper: false,
    }

    render() {
        const { filename, classes } = this.props
        return (
            <React.Fragment>
                <a
                    className={classes.link}
                    onClick={this.goToFile}
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    id={filename}
                >
                    {filename}
                </a>
                <Popper
                    open={this.state.showPopper}
                    anchorEl={document.getElementById(filename)}
                    placement="left"
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    className={classes.popper}
                >
                    <FileViewer
                        filename={this.props.filename}
                        repoRoot={this.props.basePath}
                    />
                </Popper>
            </React.Fragment>
        )
    }

    goToFile() {
        this.props.selectFile({ selectedFile: { file: this.props.filename, isFolder: false, editing: false } })
        this.props.navigateRepoPage({ repoPage: RepoPage.Files })
    }

    showPopper() {
        this.setState({ showPopper: true })
    }

    hidePopper() {
        this.setState({ showPopper: false })
    }
}

interface Props {
    filename: string
    basePath: string
    navigateRepoPage: typeof navigateRepoPage
    selectFile: typeof selectFile
    classes: any
}

interface State {
    showPopper: boolean
}

const styles = (theme: Theme) => createStyles({
    link: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    popper: {
        width: 450,
        height: 350,
        backgroundColor: theme.palette.background.default,
        border: '1px solid',
        borderColor: theme.palette.grey[400],
        overflow: 'scroll',
    },
})

const mapDispatchToProps = {
    selectFile,
    navigateRepoPage,
}

const FileLinkContainer = connect(
    null,
    mapDispatchToProps,
)(withStyles(styles)(FileLink))

export default FileLinkContainer
