import React from 'react'
import PropTypes from 'prop-types'
import EditIcon from '@material-ui/icons/Edit'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import AssignmentIcon from '@material-ui/icons/Assignment'

function EventIcon(props) {
    switch (props.eventType){
        case 'creation':
            return <ControlPointIcon className={props.className} color="secondary"/>
        case 'hypothesis':
            return <HelpOutlineIcon className={props.className} color="secondary"/>
        case 'preregistration':
            return <AssignmentIcon className={props.className} color="secondary"/>
        case 'checkpoint':
            return <EditIcon className={props.className} color="secondary"/>
        case 'publication':
            return <AssignmentIcon className={props.className} color="secondary"/>
        default:
            return <EditIcon className={props.className}/>
    }
}

EventIcon.propTypes = {
    eventType: PropTypes.string.isRequired,
}

export default EventIcon