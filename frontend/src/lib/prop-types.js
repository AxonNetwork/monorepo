import PropTypes from 'prop-types'

const PropTypes_Comment = PropTypes.shape({
    id: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
})

const PropTypes_Discussion = PropTypes.shape({
    repoID: PropTypes.string.isRequired,
    created: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
})

const PropTypes_User = PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    repos: PropTypes.arrayOf(PropTypes.string).isRequired,
})

const PropTypes_TimelineEvent = PropTypes.shape({
    commit: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(PropTypes.string).isRequired,
    message: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
})

export {
    PropTypes_Comment,
    PropTypes_Discussion,
    PropTypes_User,
    PropTypes_TimelineEvent,
}

