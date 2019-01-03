import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import CancelIcon from '@material-ui/icons/Cancel'
import { IFeaturedRepo } from 'conscience-lib/common'


class FeaturedRepoCard extends React.Component<Props>
{
	render() {
		const { repoInfo, canDelete, classes } = this.props
		return (
			<Card className={classes.card}>
				{canDelete &&
					<div className={classes.buttonRow}>
						<IconButton onClick={this.props.onEdit} >
							<EditIcon fontSize='small' />
						</IconButton>
						<IconButton onClick={this.props.onDelete} >
							<CancelIcon fontSize='small' />
						</IconButton>
					</div>
				}
				<CardActionArea>
					<CardMedia className={classes.media}>
						<img src={repoInfo.image} />
					</CardMedia>
					<CardContent>
						<Typography variant="h5">
							EDITING
						</Typography>
						<Typography>
							<em>{repoInfo.authors}</em>
						</Typography>
						<Typography>
							{repoInfo.description}
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions className={classes.actions}>
					<Button color="secondary" variant="outlined" className={classes.button}>Learn More</Button>
				</CardActions>
			</Card>
		)
	}
}

interface Props {
	repoInfo: IFeaturedRepo
	canDelete?: boolean
	onEdit: () => void
	onDelete: () => void
	classes: any
}

const styles = (theme: Theme) => createStyles({
	card: {
		marginBottom: 32,
	},
	buttonRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	media: {
		maxHeight: 150,
		overflow: 'hidden',
		"& img": {
			width: '100%'
		}
	},
	actions: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
})

export default withStyles(styles)(FeaturedRepoCard)