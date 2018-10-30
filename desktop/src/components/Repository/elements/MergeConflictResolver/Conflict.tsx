import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import CheckIcon from '@material-ui/icons/Check'
import MergeTypeIcon from '@material-ui/icons/MergeType'
import UndoIcon from '@material-ui/icons/Undo'

import CodeViewer from '../FileViewer/CodeViewer'
import { IChunkConflict } from 'utils/mergeConflict'
import autobind from 'utils/autobind'


@autobind
class Conflict extends React.Component<Props, State>
{
	_inputCombination: HTMLInputElement | null = null

	state = {
		combined: false,
	}

	render(){
		const { language, chunk, classes } = this.props
        const upstreamContent = chunk.linesUpstream.join("\n")
        const localContent = chunk.linesLocal.join("\n")
        if(!this.state.combined){
	        return(
	        	<div>
		            <div className={classes.toolbar}>
		            	<Button
		            		onClick={() => this.props.onAccept(upstreamContent)}
			            	className={classes.button}
		            	>
		            		<CheckIcon />
		            		Accept Incoming Content
		            	</Button>
		            	<Button
		            		onClick={this.onClickCombineAndEdit}
			            	className={classes.button}
		            	>
		            		<MergeTypeIcon />
		            		Combine and Edit
		            	</Button>
		            	<Button
		            		onClick={() => this.props.onAccept(localContent)}
		            		className={classes.button}
	            		>
		            		<CheckIcon />
		            		Keep Local Content
		            	</Button>
		            </div>
		        	<Card className={classes.card}>
			        	<CardContent>
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
			            </CardContent>
		            </Card>
	            </div>
			)
        }else{
        	const combined = upstreamContent + "\n" + localContent
        	return(
        		<div>
	        		<div className={classes.toolbar}>
		            	<Button
		            		onClick={this.onClickAcceptCombination}
			            	className={classes.button}
		            	>
		            		<CheckIcon />
		            		Save
		            	</Button>
		            	<Button
		            		onClick={this.onClickUncombine}
			            	className={classes.button}
		            	>
		            		<UndoIcon />
		            		Undo
		            	</Button>
	        		</div>
		        	<Card className={classes.card}>
		        		<CardContent>
			        		<FormControl fullWidth>
				        		<Input
				        			fullWidth
				        			multiline
									rowsMax={32}
					        		defaultValue={combined}
					        		inputRef={ x => this._inputCombination = x }
					        		classes={{ input: classes.input }}
				        		/>
			        		</FormControl>
		        		</CardContent>
		        	</Card>
	        	</div>
    		)
        }
	}

	onClickCombineAndEdit() {
		this.setState({ combined: true })
	}

	onClickUncombine() {
		this.setState({ combined: false })
	}

	onClickAcceptCombination() {
		if(this._inputCombination === null){
			return
		}
		const combination = this._inputCombination.value
		this.props.onAccept(combination)
	}
}

interface Props {
	language: string
	chunk: IChunkConflict
	onAccept: (content: string) => void
	classes: any
}

interface State{
	combined: boolean
}

const styles = (theme: Theme) => createStyles({
	button: {
		marginBottom: -3,
		textTransform: 'none',
        color: 'white',
        backgroundColor: '#313133',
        '&:hover': {
        	backgroundColor: '#454547',
        },
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
	card: {
		border: '2px solid #313133'
	},
	divider: {
		backgroundColor: '#313133',
		width: 1,
		marginRight: 8,
		marginLeft: 8,
	},
	input: {
		fontSize: "0.8rem",
		fontFamily: 'Consolas, "Bitstream Vera Sans Mono", "Courier New", Courier, monospace',

	},
	codeContainer: {} //passthrough
})

export default (withStyles(styles)(Conflict))