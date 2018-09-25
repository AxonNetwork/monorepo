import React from 'react'
import PropTypes from 'prop-types'

function EventTitle(props) {
    const user = props.user || 'Someone'
    const { files, version } = props
    let filesString
    if (typeof files === String) {
        filesString = files
    }else {
        filesString = files.reduce((acc, curr, i) => {
            acc.push(<code key={i}>{curr}</code>)
            if (files.length - i > 2) { acc.push(', ') }
            if (files.length - i == 2) { acc.push(' and ') }
            return acc
        }, [])
    }
    return <span><strong>v{version}: {user}</strong> edited {filesString}</span>
}

EventTitle.propTypes = {
    version: PropTypes.number.isRequired,
    user: PropTypes.string,
    files: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]).isRequired,
}

export default EventTitle