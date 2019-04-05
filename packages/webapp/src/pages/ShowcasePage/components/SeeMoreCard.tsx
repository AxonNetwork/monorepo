import React from 'react'
import Typography from '@material-ui/core/Typography'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ActionCard from './ActionCard'

function SeeMoreCard(props: Props) {
    return (
        <ActionCard onClick={props.onClick} >
            <Typography>
                View {props.count} other studies
			</Typography>
            <ArrowForwardIcon />
        </ActionCard>
    )
}

interface Props {
    count: number
    onClick: () => void
}

export default SeeMoreCard
