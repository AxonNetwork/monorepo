import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { autobind } from 'conscience-lib/utils'


@autobind
class SelectRepoDialog extends React.Component<Props>
{

	render() {
		const { open, repoList } = this.props

		return (
			<Dialog onClose={() => this.props.onSelect('')} open={open}>
				<DialogTitle>
					Select a repository
				</DialogTitle>
				{repoList.length === 0 &&
					<DialogContent>
						<DialogContentText>
							There are no other repositories to choose from
						</DialogContentText>
					</DialogContent>
				}
				<List>
				{repoList.map(repoID=>(
					<ListItem
						button
						onClick={() => this.props.onSelect(repoID)}
					>
						<ListItemText primary={repoID} />
					</ListItem>
				))}
				</List>
			</Dialog>
		)
	}
}

interface Props {
	open: boolean
	repoList: string[]
	onSelect: (selected: string) => void
	classes: any
}

const styles = (theme: Theme) => createStyles({})

export default withStyles(styles)(SelectRepoDialog)