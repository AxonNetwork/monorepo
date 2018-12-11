import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import { autobind } from 'conscience-lib/utils'
import FileViewer from '../FileViewer'

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
                        repoRoot={this.props.repoRoot}
                    />
                </Popper>
            </React.Fragment>
        )
    }

    goToFile() {
        const filename = this.props.filename
        this.props.selectFile({ filename })
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
    repoRoot: string
    selectFile: (payload: {filename: string}) => void
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

export default withStyles(styles)(FileLink)
