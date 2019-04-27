import moment from 'moment'
import classnames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'
import bytes from 'bytes'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import { IRepoFile, URI } from 'conscience-lib/common'
import { autobind, repoUriToString } from 'conscience-lib/utils'
import { IGlobalState } from 'conscience-components/redux'
import { H5 } from 'conscience-components/Typography/Headers'

@autobind
class FileDetailsSidebar extends React.Component<Props>
{
    render() {
        let { open, file, classes } = this.props
        if (!file) {
            return null
        }

        return (
            <Drawer
                variant="permanent"
                anchor="right"
                classes={{
                    paper: classnames(classes.fileDetailsSidebar, open && classes.open),
                }}
                open={open}
            >
                <div className={classes.fileDetailsSidebarContentRoot}>
                    <div className={classes.fileDetailsSidebarHeader}>
                        <H5 className={classes.fileDetailsSidebarHeaderText}>{file.name}</H5>
                        <IconButton onClick={this.props.onClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <div className={classes.fileDetailsSidebarStats}>
                        <div>Kanban board</div>
                        <div>Last modified {moment((file || {}).modified).fromNow()}</div>
                        <div>{bytes(file.size)}</div>
                    </div>
                </div>
            </Drawer>
        )
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    uri: URI|undefined
    open?: boolean
    onClose: () => void
}

interface StateProps {
    file: IRepoFile|undefined
}

const styles = (theme: Theme) => createStyles({
    fileDetailsSidebar: {
        width: 0,
        marginLeft: 20,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    fileDetailsSidebarContentRoot: {
        padding: 20,
    },
    open: {
        width: 400,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    fileDetailsSidebarHeader: {
        marginBottom: 24,
        borderBottom: '1px solid #e2e2e2',
        paddingBottom: 10,
        display: 'flex',
    },
    fileDetailsSidebarHeaderText: {
        flexGrow: 1,
    },
    fileDetailsSidebarStats: {
        color: '#a9a9a9',
        fontSize: '0.8rem',
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    let { uri } = ownProps
    if (!uri) {
        return {
            file: undefined,
        }
    }

    return {
        file: state.repo.filesByURI[repoUriToString(uri)][uri.filename || ''],
    }
}

const mapDispatchToProps = {}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(FileDetailsSidebar))
