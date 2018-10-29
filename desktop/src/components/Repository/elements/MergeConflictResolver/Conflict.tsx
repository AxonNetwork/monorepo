import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CheckIcon from '@material-ui/icons/Check'
import MergeTypeIcon from '@material-ui/icons/MergeType'

import CodeViewer from '../CodeViewer'
import { IChunk } from 'utils/mergeConflict'
import autobind from 'utils/autobind'


@autobind
class Conflict extends React.Component<Props, State>
{
	state = {
		combined: false,
	}

	render(){
		const { language, upstreamChunk, localChunk, classes } = this.props
        const upstreamContent = upstreamChunk.lines.join("\n")
        const localContent = ((localChunk || {}).lines || []).join("\n")
        if(!this.state.combined){
	        return(
	        	<div>
		            <div className={classes.toolbar}>
		            	<Button
		            		onClick={() => this.onClickAcceptContent(upstreamContent)}
			            	className={classes.button}
		            	>
		            		<CheckIcon />
		            		Accept Incoming Chunk
		            	</Button>
		            	<Button
		            		onClick={this.onClickCombineAndEdit}
			            	className={classes.button}
		            	>
		            		<MergeTypeIcon />
		            		Combine and Edit
		            	</Button>
		            	<Button
		            		onClick={() => this.onClickAcceptContent(localContent)}
		            		className={classes.button}
	            		>
		            		<CheckIcon />
		            		Accept Local Chunk
		            	</Button>
		            </div>
		            <div className={classes.split}>
		                <div className={classes.column}>
		                    <CodeViewer
		                        language={language}
		                        contents={upstreamContent}
		                        classes={{codeContainer: classes.codeContainer}}
		                    />
		                </div>
		                <div className={classes.divider}></div>
		                <div className={classes.column}>
		                    <CodeViewer
		                        language={language}
		                        contents={localContent}
		                        classes={{codeContainer: classes.codeContainer}}
		                    />
		                </div>
		            </div>
	            </div>
			)
        }else{
        	const combined = upstreamContent + "\n" + localContent
        	return(
	        	<div>
	        		<div className={classes.toolbar}>
		            	<Button
		            		onClick={() => this.onClickAcceptContent("asdf")}
			            	className={classes.button}
		            	>
		            		<CheckIcon />
		            		Accept
		            	</Button>
		            	<Button
		            		onClick={this.onClickUncombine}
			            	className={classes.button}
		            	>
		            		<CheckIcon />
		            		Undo Combine
		            	</Button>
	        		</div>
	        		<TextField
	        			fullWidth
	        			multiline
						rowsMax={32}
		        		defaultValue={combined}
	        		/>
	        	</div>
    		)
        }
	}

	onClickAcceptContent(content: string){

	}

	onClickCombineAndEdit() {
		this.setState({ combined: true })
	}

	onClickUncombine() {
		this.setState({ combined: false })
	}
}

interface Props {
	language: string
	upstreamChunk: IChunk
	localChunk: IChunk
	classes: any
}

interface State{
	combined: boolean
}

const styles = (theme: Theme) => createStyles({
	button: {
		border: '1px solid ' + theme.palette.grey[300],
		marginBottom: -1,
		textTransform: 'none'
	},
	toolbar: {
		display: 'flex',
		justifyContent: 'space-between',
		borderBottom: '1px solid ' + theme.palette.grey[300],
	},
	split: {
		display: 'flex'
	},
	column: {
		flexGrow: 1,
		paddingTop: 8
	},
	divider: {
		backgroundColor: theme.palette.grey[300],
		width: 1,
		marginRight: 8,
		marginLeft: 8,
	},
	codeContainer: {} //passthrough
})

export default (withStyles(styles)(Conflict))