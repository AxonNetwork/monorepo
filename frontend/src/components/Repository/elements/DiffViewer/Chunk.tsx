import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import LineChunkContent from './LineChunkContent'
import SheetChunkContent from './SheetChunkContent'

class Chunk extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    handleChange = (event, expanded) =>{
        this.setState({expanded: expanded})
    }

    render() {
        const {classes, chunk, filename, type} = this.props
        const changes = chunk.changes.reduce((acc, curr)=>{
            if(curr.content[0] === "+") acc.add++
            if(curr.content[0] === "-") acc.del++
            return acc
        }, {add: 0, del: 0})
        return (
            <React.Fragment>
                <ExpansionPanel onChange={this.handleChange}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} classes={{root:classes.summaryRoot}}>
                        <code>{filename + ": Added " + changes.add + " and deleted "+ changes.del + " around line " + chunk.newStart}</code>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails classes={{root:classes.detailsRoot}}>
                        {this.state.expanded &&
                            <div>
                                {type === "text" &&
                                    <div className={classes.overflow}>
                                        <LineChunkContent chunk={chunk} />
                                    </div>
                                }
                                {type === "data" &&
                                    <SheetChunkContent chunk={chunk} />
                                }
                            </div>
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </React.Fragment>
        )
    }
}

Chunk.propTypes = {
    classes: PropTypes.object.isRequired,
    chunk: PropTypes.object.isRequired,
}

const styles = theme => ({
    row:{
        height: '24px',
        border: 0,
    },
    summaryRoot:{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.secondary.main,
        fontWeight: 'bold'
    },
    detailsRoot:{
        padding: 0
    },
    button:{
        textTransform: 'none'
    }
})

export default withStyles(styles)(Chunk)
