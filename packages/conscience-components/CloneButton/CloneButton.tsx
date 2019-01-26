import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CircularProgress from '@material-ui/core/CircularProgress'
import GetAppIcon from '@material-ui/icons/GetApp'
import Tooltip from '@material-ui/core/Tooltip'
import { cloneRepo } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { NetworkURI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class CloneButton extends React.Component<Props>
{
    _inputCommitMessage: HTMLInputElement | null = null

    render() {
        const { cloneProgress, classes } = this.props

        let cloneLoading = cloneProgress !== undefined
        let percentCloned
        if (cloneLoading) {
            percentCloned = Math.floor(100 * ((cloneProgress || {} as any).fetched || 0) / ((cloneProgress || {} as any).toFetch || 1))
            // min 10 so the progress spinner shows something
            percentCloned = Math.max(percentCloned, 10)
            if (percentCloned === 100) {
                // clone complete
                cloneLoading = false
            }
        }

        return (
            <div className={classes.root}>
                <Tooltip title="Download this repository to your computer">
                    <IconButton
                        classes={{ root: classes.button }}
                        disabled={cloneLoading}
                        onClick={this.onClickClone}
                    >
                        {!cloneLoading && <GetAppIcon className={classes.icon} fontSize="large" />}
                        {cloneLoading &&
                            <CircularProgress
                                size={32}
                                className={classes.buttonLoading}
                                value={percentCloned}
                                variant="determinate"
                            />
                        }
                    </IconButton>
                </Tooltip>
            </div>
        )
    }

    onClickClone() {
        this.props.cloneRepo({ uri: this.props.uri })
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: NetworkURI
    classes?: any
}

interface StateProps {
    cloneProgress: { fetched: number, toFetch: number } | undefined
}

interface DispatchProps {
    cloneRepo: typeof cloneRepo
}

const styles = (theme: Theme) => createStyles({
    root: {}, // overridable
    button: {
        padding: 8,
        border: '1px solid #aaa'
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        cloneProgress: state.ui.cloneRepoProgressByID[ownProps.uri.repoID]
    }
}

const mapDispatchToProps = {
    cloneRepo
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CloneButton))
