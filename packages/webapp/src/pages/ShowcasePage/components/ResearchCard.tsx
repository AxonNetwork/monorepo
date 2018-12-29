import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'


class ResearchCard extends React.Component<Props>
{
	render() {
		const { img, title, description, author, classes } = this.props
		return (
			<Card className={classes.card}>
				<CardActionArea>
					<CardMedia className={classes.media}>
						<img src={img} />
					</CardMedia>
					<CardContent>
						<Typography variant="h5">
							{title}
						</Typography>
						<Typography>
							<em>{author}</em>
						</Typography>
						<Typography>
							{description}
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
	img: string
	title: string
	description: string
	author: string
	classes: any
}

const styles = (theme: Theme) => createStyles({
	card: {
		width: 350,
		marginRight: 32,
		marginBottom: 32,
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
	}
})

export default withStyles(styles)(ResearchCard)