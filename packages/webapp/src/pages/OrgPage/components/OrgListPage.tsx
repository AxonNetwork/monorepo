import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { fetchUserOrgs } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import { IOrganization } from 'conscience-lib/common'
import autobind from 'conscience-lib/utils/autobind'


@autobind
class OrgList extends React.Component<Props>
{
	componentDidMount(){
		this.props.fetchUserOrgs({})
	}

	render() {
		const { orgs, orgList, classes } = this.props
		return (
			<List className={classes.list}>
				{orgList.map(id=>(
					<Link to={`/org/${id}`} className={classes.link}>
						<ListItem button>
							<ListItemText primary={(orgs[id] || {}).name || id} />
						</ListItem>
					</Link>
				))}
			</List>
		)
	}
}

interface Props {
	orgs: {[orgID: string]: IOrganization}
	orgList: string[]
	fetchUserOrgs: typeof fetchUserOrgs
	classes: any
}

const styles = (theme: Theme) => createStyles({
	list: {
		border: '1px solid ' + theme.palette.grey[600],
	},
})

const mapStateToProps = (state: IGlobalState) => {
	const user = state.user.users[state.user.currentUser || '']
    return {
    	orgs: state.org.orgs,
    	orgList: (user || {}).orgs || [],
    }
}

const mapDispatchToProps = {
	fetchUserOrgs
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgList))
