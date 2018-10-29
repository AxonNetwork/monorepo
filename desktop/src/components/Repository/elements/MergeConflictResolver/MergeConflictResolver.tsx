import React from 'react'
import { connect } from 'react-redux'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'

import { IGlobalState } from 'redux/store'
import autobind from 'utils/autobind'


@autobind
class MergeConflictResolver extends React.Component<Props, State>
{
    render() {
        // const { classes } = this.props

        return (
            <div>
                Merge Conflicts
            </div>
        )
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    repoRoot: string
    filename: string
}

interface StateProps {}

interface DispatchProps {}

interface State {}

const styles = (theme: Theme) => createStyles({})


const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {}
}

const mapDispatchToProps = {}

export default connect< StateProps, DispatchProps, OwnProps, IGlobalState >(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(MergeConflictResolver))
