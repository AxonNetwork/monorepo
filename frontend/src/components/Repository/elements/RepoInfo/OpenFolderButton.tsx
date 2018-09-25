import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
// import { shell } from 'electron'
const shell = window.require('electron').shell

class OpenFolderButton extends Component {
    constructor(props){
        super(props)
        this.openFolder = this.openFolder.bind(this)
    }

    openFolder(){
        shell.openItem(this.props.folderPath)
    }

    render() {
        const classes = this.props.classes
        return (
            <div className={classes.button} onClick={this.openFolder}>
                <FolderOpenIcon className={classes.icon}/>
            </div>
        )
    }
}

OpenFolderButton.propTypes = {
    folderPath: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
}

const styles = theme => ({
    button:{
        position: 'absolute',
        textAlign: 'right',
        top: 0,
        right: 0,
        width: 0,
        height: 0,
        borderTop: '64px solid',
        borderTopColor: theme.palette.secondary.main,
        borderLeft: '64px solid transparent',
        color: 'white',
        overflow: 'show'
    },
    icon:{
        position: 'absolute',
        top: '-56px',
        right: '8px'
    }
})

export default withStyles(styles)(OpenFolderButton)
