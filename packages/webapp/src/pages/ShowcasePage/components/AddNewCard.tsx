import React from 'react'
import Typography from '@material-ui/core/Typography'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import ActionCard from './ActionCard'

function AddNewCard(props: Props){
	return(
		<ActionCard onClick={props.onClick} >
			<Typography>
				Add New Featured Repo
			</Typography>
			<ControlPointIcon />
		</ActionCard>
	)
}

interface Props {
	onClick: () => void
}

export default AddNewCard
