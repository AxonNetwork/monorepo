import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'

function Container(props: Props){
	return (
		<div className={props.classes.root}>
			<div className={props.classes.container}>
				{props.children}
			</div>
		</div>
	)
}

interface Props {
	children: any
	classes: any
}


const styles = (theme: Theme) => createStyles({
	root: {
		display: 'flex',
		justifyContent: 'center',
	},
	container: {
		width: '80%',
		marginTop: 32,
	}
})

export default withStyles(styles)(Container)
