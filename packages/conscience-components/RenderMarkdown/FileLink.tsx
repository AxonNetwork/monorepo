import React from 'react'
import { Link } from 'react-router-dom'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import FileViewer from '../FileViewer'
import { FileMode, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { selectFile, getFileURL } from 'conscience-components/navigation'

@autobind
class FileLink extends React.Component<Props, State>
{
    state = {
        showPopper: false,
    }

    _anchorElement: HTMLSpanElement | null = null

    render() {
        const { classes } = this.props
        const boundariesElement = document.getElementById('hihihi') // @@TODO: either pass ref via props, or rename div ID to something sane
        const uri = { ...this.props.uri }
        uri.commit = uri.commit || 'HEAD'

        return (
            <React.Fragment>
                <span ref={x => this._anchorElement = x}>
                    <Link to={getFileURL(uri, FileMode.View)}
                        className={classes.link}
                        onMouseEnter={this.showPopper}
                        onMouseLeave={this.hidePopper}
                    >
                        {this.props.uri.filename || ''}
                    </Link>
                </span>
                <Popper
                    open={this.state.showPopper}
                    anchorEl={this._anchorElement}
                    placement="top"
                    onMouseEnter={this.showPopper}
                    onMouseLeave={this.hidePopper}
                    style={{ zIndex: 999, maxHeight: window.innerHeight * 0.8 }}
                    popperOptions={{
                        modifiers: {
                            preventOverflow: { enabled: true, boundariesElement },
                        },
                    }}
                    className={classes.popper}
                >
                    <FileViewer
                        uri={uri}
                        autoHideToolbar
                        classes={{ codeContainer: classes.codeContainer }}
                    />
                </Popper>
            </React.Fragment>
        )
    }

    goToFile = () => {
        const uri = { ...this.props.uri }
        uri.commit = uri.commit || 'HEAD'
        selectFile(uri, FileMode.View)
    }

    showPopper = () => {
        this.setState({ showPopper: true })
    }

    hidePopper = () => {
        this.setState({ showPopper: false })
    }
}

type Props = OwnProps & { classes: any }

interface OwnProps {
    uri: URI
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
        maxWidth: '50%',
        maxHeight: '50%',
        backgroundColor: theme.palette.background.default,
        border: '1px solid',
        borderColor: theme.palette.grey[400],
        overflow: 'auto',
        zIndex: 10,
        boxShadow: '1px 1px 6px #00000021',
    },
    codeContainer: {
        overflowX: 'unset',
    },
})

export default withStyles(styles)(FileLink)
