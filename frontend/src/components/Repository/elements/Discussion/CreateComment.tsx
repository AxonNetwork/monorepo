import { endsWith } from 'lodash'
import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ButtonBase from '@material-ui/core/ButtonBase'
import SendIcon from '@material-ui/icons/Send'
import autobind from 'utils/autobind'
import { IRepoFile } from 'common'

@autobind
class CreateComment extends React.Component<Props, State>
{
    state = {
        comment: '',
        anchorEl: null,
        embedType: null,
        position: 0,
    }

    handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter' && event.shiftKey) {
            this.handleSubmit(event)
            return
        }
    }

    handleChange(event:  React.ChangeEvent<HTMLTextAreaElement>) {
        const text = event.target.value
        const cursor = event.target.selectionStart

        let lastToken = ''
        for (let i = text.length - 1; i >= 0; i--) {
            if (text[i] === ' ') {
                break
            } else {
                lastToken = text[i] + lastToken
            }
        }

        if (lastToken === '@file') {
            this.setState({
                anchorEl: event.target,
                position: cursor-5,
                embedType: '@file',
            })
        } else if (lastToken === '@image') {
            this.setState({
                anchorEl: event.target,
                position: cursor-6,
                embedType: '@image',
            })
        } else {
            this.setState({
                anchorEl: null,
                position: 0,
                embedType: null,
            })
        }
        this.setState({comment: event.target.value})
    }

    handleSubmit(event: React.KeyboardEvent<HTMLDivElement>|React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        this.props.onSubmit(this.state.comment)
        this.setState({comment:''})
    }

    handleClose(embedType: string, refTarget: string){
        this.setState({
            anchorEl: null,
            position: 0,
            embedType: null,
        })
        if (refTarget.length === 0) {
            return
        }
        const ref = embedType+":["+refTarget+"] "
        const position = this.state.position
        let comment = this.state.comment
        comment = comment.substring(0, position) + ref + comment.substring(position + 5)
        this.setState({comment: comment})
    }

    render(){
        const { files, classes } = this.props
        const fileNames = Object.keys(files || {})

        return (
            <form onSubmit={this.handleSubmit} className={classes.reply}>
                <TextField
                    id="comment"
                    value={this.state.comment}
                    placeholder="Comment (Shift + Enter to send)"
                    multiline
                    rows={2}
                    rowsMax={8}
                    onChange={this.handleChange}
                    onKeyUp={this.handleKeyPress}
                    className={classes.textField}
                />
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.embedType !== null}
                    onClose={()=>this.handleClose('')}
                >
                    {this.state.embedType === '@file' && fileNames.map((file: string)=>(
                        <MenuItem
                            onClick={()=>this.handleClose('@file', file)}
                            classes={{root:classes.menuItem}}
                        >
                            {file}
                        </MenuItem>
                    ))}
                    {this.state.embedType === '@image' && fileNames.filter((f: string) => endsWith(f, '.jpg')).map((file: string)=>(
                        <MenuItem
                            onClick={()=>this.handleClose('@image', file)}
                            classes={{root:classes.menuItem}}
                        >
                            {file}
                        </MenuItem>
                    ))}
                </Menu>
                <ButtonBase type="submit" className={classes.submit}>
                    <SendIcon className={classes.icon}/>
                </ButtonBase>
            </form>

        )
    }
}

export interface Props {
    files:{[name: string]: IRepoFile}|undefined
    onSubmit:(comment:string)=>void
    classes: any
}

export interface State {
    comment: string
    anchorEl: any
    position: number
    embedType: string|null
}

const styles = (theme: Theme) => createStyles({
    reply: {
        display: 'flex',
        alignSelf: 'flex-end',
        width: '100%',
        borderTop: '1px solid',
        borderColor: theme.palette.grey[300],
    },
    textField: {
        flexGrow: 1,
        padding: theme.spacing.unit,
        minHeight: 64
    },
    submit: {
        padding: theme.spacing.unit,
        borderRadius: 4,
    },
    icon: {
        color: theme.palette.grey[700],
    },
    menuItem:{
        maxWidth: 300
    }
})

export default withStyles(styles)(CreateComment)
