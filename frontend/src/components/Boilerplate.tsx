import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

class Boilerplate extends Component {

    constructor(props) {
        super(props)

    }

    render() {
        const classes = this.props.classes

        return (
            <div></div>
        )
    }
}

Boilerplate.propTypes = {
    classes: PropTypes.object.isRequired,
}

const styles = theme => ({

})

export default withStyles(styles)(Boilerplate)
