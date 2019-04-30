import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Popper from '@material-ui/core/Popper'
import FileViewer from '../FileViewer'
import { FileMode, URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { selectFile, getFileURL } from 'conscience-components/navigation'
import { setFileDetailsSidebarURI, showFileDetailsSidebar } from 'conscience-components/redux/ui/uiActions'

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
                        onClick={this.onClick}
                        onMouseEnter={undefined /*this.showPopper*/}
                        onMouseLeave={undefined /*this.hidePopper*/}
                    >
                        {this.props.uri.filename || ''}
                    </Link>
                </span>
                <Popper
                    open={this.state.showPopper}
                    anchorEl={this._anchorElement}
                    placement="top"
                    onMouseEnter={undefined /*this.showPopper*/}
                    onMouseLeave={undefined /*this.hidePopper*/}
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

    onClick = (evt: React.MouseEvent) => {
        evt.preventDefault()
        evt.stopPropagation()
        this.props.setFileDetailsSidebarURI({ uri: this.props.uri })
        this.props.showFileDetailsSidebar({ open: true })
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

type Props = OwnProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
}

interface DispatchProps {
    showFileDetailsSidebar: typeof showFileDetailsSidebar
    setFileDetailsSidebarURI: typeof setFileDetailsSidebarURI
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

const mapDispatchToProps = {
    showFileDetailsSidebar,
    setFileDetailsSidebarURI,
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(FileLink))
