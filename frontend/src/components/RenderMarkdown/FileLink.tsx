import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { selectFile, navigateRepoPage } from 'redux/repository/repoActions'
import { RepoPage } from 'redux/repository/repoReducer'
import autobind from 'utils/autobind'

@autobind
class FileLink extends React.Component<Props>
{
    render() {
        const { fileRef, classes } = this.props
        return (
            <a className={classes.link} onClick={this.goToFile}>
                {fileRef}
            </a>
        )
    }

    goToFile() {
        this.props.selectFile({ selectedFile: { file: this.props.fileRef, isFolder: false } })
        this.props.navigateRepoPage({ repoPage: RepoPage.Files })
    }
}

interface Props {
    fileRef: string
    navigateRepoPage: typeof navigateRepoPage
    selectFile: typeof selectFile
    classes: any
}

const styles = (theme: Theme) => createStyles({
    link: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
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
