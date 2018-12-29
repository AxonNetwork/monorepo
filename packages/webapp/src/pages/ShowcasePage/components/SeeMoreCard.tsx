import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'


class SeeMoreCard extends React.Component<Props>
{
	render() {
		const { classes } = this.props
		return (
			<Card className={classes.card}>
				<CardActionArea className={classes.actionArea}>
					<Typography className={classes.text}>
						View 300+ other studies
					</Typography>
					<ArrowForwardIcon classes={{root: classes.icon}}/>
				</CardActionArea>
			</Card>
		)

	}
}

interface Props {
	classes: any
}

const styles = (theme: Theme) => createStyles({
	card: {
		width: 350,
		marginRight: 32,
		marginBottom: 32,
		border: '2px solid ' + theme.palette.secondary.main,
	},
	actionArea: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%'
	},
	text: {
		fontSize: '18pt',
		color: theme.palette.secondary.main,
		marginBottom: 16
	},
	icon: {
		color: theme.palette.secondary.main,
		width: '2.25em',
		height: '2.25em'
	}
})

export default withStyles(styles)(SeeMoreCard)