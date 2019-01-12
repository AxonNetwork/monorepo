import React from 'react'
import { connect } from 'react-redux'
import OrgBlog from 'conscience-components/OrgBlog/OrgBlog'
import { IGlobalState } from 'redux/store'
import { IOrgBlog } from 'conscience-lib/common'
import { fetchOrgBlogs } from 'redux/org/orgActions'


class ConnectedOrgBlog extends React.Component<Props>
{
    render() {
        return (
            <OrgBlog
                orgID={this.props.orgID}
                limit={this.props.limit}
                blogs={this.props.blogs}
                fetchOrgBlogs={this.props.fetchOrgBlogs}
            />
        )
    }
}

type Props = OwnProps & StateProps & DispatchProps

interface OwnProps {
    orgID: string
    limit?: number
}

interface StateProps {
    blogs: {
        map: {[created: string]: IOrgBlog}
        sortedIDs: number[],
    }
}

interface DispatchProps {
    fetchOrgBlogs: Function
}

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
        blogs: state.org.blogs[ ownProps.orgID ] || {},
    }
}

const mapDispatchToProps = {
    fetchOrgBlogs,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ConnectedOrgBlog)
