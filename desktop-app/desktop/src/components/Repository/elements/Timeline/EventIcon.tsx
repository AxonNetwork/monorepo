import React from 'react'
import EditIcon from '@material-ui/icons/Edit'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import AssignmentIcon from '@material-ui/icons/Assignment'

export interface EventIconProps {
    eventType: string
    className: string
}

function EventIcon(props: EventIconProps) {
    const { eventType, className } = props
    switch (eventType){
        case 'creation':
            return <ControlPointIcon className={className} color="secondary"/>
        case 'hypothesis':
            return <HelpOutlineIcon className={className} color="secondary"/>
        case 'preregistration':
            return <AssignmentIcon className={className} color="secondary"/>
        case 'checkpoint':
            return <EditIcon className={className} color="secondary"/>
        case 'publication':
            return <AssignmentIcon className={className} color="secondary"/>
        default:
            return <EditIcon className={className}/>
    }
}

export default EventIcon