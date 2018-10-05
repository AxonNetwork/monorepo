import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

import { setCodeColorScheme, logout } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import autobind from 'utils/autobind'
import CodeViewer from '../Repository/elements/CodeViewer';
const schemes = require('react-syntax-highlighter/styles/prism')

@autobind
class Settings extends React.Component<Props>
{
    onChangeCodeColorScheme(evt: any) {
        this.props.setCodeColorScheme({ codeColorScheme: evt.target.value })
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <div className={classes.section}>
                    <Typography variant="headline" className={classes.headline}>Settings</Typography>
                </div>
                <div className={classes.section}>
                    <Typography variant="subheading">Select Color Scheme: </Typography>
                    <Select onChange={this.onChangeCodeColorScheme} value={this.props.codeColorScheme}>
                        {Object.keys(schemes).map(s => (
                            <MenuItem value={s}>{s}</MenuItem>
                        ))}
                    </Select>
                    <CodeViewer
                        language="python"
                        contents="print('Example Code')"
                        codeColorScheme={this.props.codeColorScheme}
                    />
                </div>
                <div className={classes.section}>
                    <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.props.logout()}>
                        Logout
                    </Button>
                </div>
            </div>
        )
    }
}

interface Props {
    codeColorScheme: string | undefined
    setCodeColorScheme: typeof setCodeColorScheme
    logout: typeof logout
    classes: any
}

const styles = (theme: Theme) => createStyles({
    section:{
        marginBottom: theme.spacing.unit * 4
    },
    button: {
        textTransform: 'none',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return{
        codeColorScheme: state.user.codeColorScheme
    }
}

const mapDispatchToProps = {
    setCodeColorScheme,
    logout,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(Settings))