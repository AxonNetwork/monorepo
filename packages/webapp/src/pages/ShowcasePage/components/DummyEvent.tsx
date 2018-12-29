import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import AssessmentIcon from '@material-ui/icons/Assessment'
import CodeIcon from '@material-ui/icons/Code'
import CommentIcon from '@material-ui/icons/Comment'
import AddCommentIcon from '@material-ui/icons/AddComment'
import MessageIcon from '@material-ui/icons/Message'
import ShowChartIcon from '@material-ui/icons/ShowChart'
import moment from 'moment'


class DummyEvent extends React.Component<Props>
{
	render() {
		const classes = this.props.classes
		const { author, action, study, time } = this.props.event
		return (
			<div className={classes.event}>
				<div className={classes.sideline} />
				<div className={classes.eventIcon}>
					<Avatar className={classes.avatar}>
						<EventIcon action={action}/>
					</Avatar>
				</div>
				<div className={classes.eventInfo}>
					<Typography>
						<strong>{author}</strong>
						<span>{' '+ action +' '}</span>
					</Typography>
					<Typography noWrap>
						<em>{study}</em>
					</Typography>
					<Typography className={classes.time}>
						{moment(time).fromNow()}
					</Typography>
				</div>
			</div>
		)

	}
}

interface Props {
	event: {
		author: string
		action: string
		study: string
		time: Date
	}
	classes: any
}

function EventIcon({ action }: {action: string}) {
	switch(action){
		case 'commented on':
			return <AddCommentIcon />

		case 'opened a discussion on':
			return <CommentIcon />

		case 'reviewed':
			return <MessageIcon />

		case 'uploaded data to':
		case 'updated dataset for':
			return <AssessmentIcon />

		case 'added analysis to':
			return <ShowChartIcon />

		case 'edited source code for':
			return <CodeIcon />
	}
	return <CommentIcon />
}

const styles = (theme: Theme) => createStyles({
	sideline: {
		position: 'absolute',
		width: '1px',
		height: '100%',
		backgroundColor: theme.palette.grey[500],
		left: 20
	},
	event: {
		padding: '16px 0',
		display: 'flex',
		alignItems: 'center',
		position: 'relative'
	},
	avatar: {
		width: 40,
		height: 40,
		marginRight: 16,
		backgroundColor: theme.palette.background.default,
		color: theme.palette.grey[700],
		border: '2px solid ' + theme.palette.grey[700]
	},
	eventInfo: {
		maxWidth: 'calc(100% - 64px)',
		flexGrow: 1
	},
	time: {
		color: theme.palette.grey[700]
	}
})

export default withStyles(styles)(DummyEvent)