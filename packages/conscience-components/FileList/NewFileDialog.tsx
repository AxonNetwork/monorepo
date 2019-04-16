import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import { autobind } from 'conscience-lib/utils'

import spreadsheetImage from 'conscience-lib/plugins/defaults/spreadsheet.png'
import markdownImage from 'conscience-lib/plugins/defaults/markdown.png'
import kanbanImage from 'conscience-lib/plugins/defaults/kanban.png'
import textFileImage from 'conscience-lib/plugins/defaults/text-file.png'

const templates = [
    {
        name: 'Empty file',
        image: textFileImage,
        description: 'Create an empty text file.',
        extension: '',
    },
    {
        name: 'Markdown',
        image: markdownImage,
        description: 'Markdown lets you use simple text-based annotations to style and format documents with headings, lists, bold and italics, etc.',
        extension: '.md',
    },
    {
        name: 'Spreadsheet',
        image: spreadsheetImage,
        description: 'A simple spreadsheet in CSV (comma-separated values) format.',
        extension: '.csv',
    },
    {
        name: 'Kanban',
        image: kanbanImage,
        description: 'A Kanban board is a great way to organize a set of tasks.',
        extension: '.kanban',
    },
]

@autobind
class NewFileDialog extends React.Component<Props, State>
{
    _inputNewFileName: HTMLInputElement | null = null

    state = {
        selectedTemplate: 0,
    }

    onSelectTemplate = (idx: number) => {
        this.setState({ selectedTemplate: idx })
    }

    render() {
        const { classes } = this.props
        const selectedTemplate = templates[this.state.selectedTemplate]

        return (
            <Dialog
                maxWidth={false}
                open={this.props.open}
                onClose={this.props.onClickCancel}
            >
                <form>
                    <DialogTitle>Create new file</DialogTitle>
                    <DialogContent>
                        <div className={classes.templateWrapper}>
                            <List
                                classes={{ root: classes.listRoot }}
                                subheader={<ListSubheader component="div" style={{ backgroundColor: 'white' }}>Templates</ListSubheader>}
                            >
                                {templates.map((tpl, i) => (
                                    <ListItem
                                        button
                                        selected={this.state.selectedTemplate === i}
                                        onClick={() => this.onSelectTemplate(i)}
                                    >
                                          <ListItemText primary={tpl.name} classes={{ root: classes.templateListItemText }} />
                                    </ListItem>
                                ))}
                            </List>

                            <div className={classes.templatePreview}>
                                <img src={selectedTemplate.image} />
                                <div className={classes.templateDescription}>
                                    {selectedTemplate.description}
                                </div>
                            </div>
                        </div>

                        <div>
                            <TextField
                                label="File name"
                                fullWidth
                                autoFocus
                                inputRef={x => this._inputNewFileName = x}
                                InputProps={{
                                    endAdornment: selectedTemplate.extension.length > 0
                                        ? <InputAdornment position="end">
                                              <Typography color="secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>
                                                  {selectedTemplate.extension}
                                              </Typography>
                                          </InputAdornment>
                                        : undefined
                                }}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" variant="contained" onClick={this.onClickCreate}>Create</Button>
                        <Button color="secondary" variant="outlined" onClick={this.props.onClickCancel}>Cancel</Button>
                    </DialogActions>
                </form>
            </Dialog>
        )
    }

    onClickCreate = () => {
        const filename = this._inputNewFileName!.value.trim()
        const ext = templates[this.state.selectedTemplate].extension
        this.props.onClickCreate(filename + ext)
    }
}

interface Props {
    open: boolean
    onClickCancel: () => void
    onClickCreate: (filename: string) => void
    classes?: any
}

interface State {
    selectedTemplate: number
}

const styles = (theme: Theme) => createStyles({
    templateWrapper: {
        display: 'flex',
        marginBottom: 36,
    },
    templatePreview: {
        width: 580,
        height: 280,
    },
    templateDescription: {
        fontSize: '0.9rem',
        color: '#565656',
        marginTop: 12,
        paddingLeft: 22,
    },
    templateListItemText: {
        '&:first-child': {
            paddingLeft: 12,
        }
    },
    listRoot: {
        width: 200,
        padding: 0,
        flexGrow: 1,
        height: 280,
        overflowY: 'auto',
    },
})


export default withStyles(styles)(NewFileDialog)
