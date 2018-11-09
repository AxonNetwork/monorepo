import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import autobind from 'utils/autobind'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'

@autobind
class FormattingHelp extends React.Component<Props, State>
{
    state = {
        syntaxModalOpen: false,
    }

    openSyntaxModal() {
        this.setState({ syntaxModalOpen: true })
    }

    closeSyntaxModal() {
        this.setState({ syntaxModalOpen: false })
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <div className={classes.formattingHelpText}>
                    This text field supports Markdown syntax for formatting, including <strong>**bold**</strong>, <em>_italics_</em>, and more.  You can also use <code>@file</code>, <code>@image</code>, and other codes to refer to things in this repository.  <a onClick={this.openSyntaxModal}>Click here</a> for a quick rundown.
                </div>
                <Dialog open={this.state.syntaxModalOpen}>
                    <DialogTitle>Formatting codes</DialogTitle>
                    <DialogContent className={classes.dialog}>
                        <p>This text field supports Markdown syntax, as well as a few special codes for referring to other files in this repository.  Here's a quick rundown.</p>
                        <ul>
                            <li><strong>**asterisks make things bold**</strong></li>
                            <li><em>_underscores italicize_</em></li>
                            <li>
                                You can create lists with dashes or numbers:
                                <pre><code>{`
- one
- two
- three
                                `}</code></pre>

                                <pre><code>{`
1. one
2. two
3. three
                                `}</code></pre>
                            </li>
                            <li>
                                Link to things in this repo by typing the following codes:
                                <ul>
                                    <li><code>@file</code> for files</li>
                                    <li><code>@image</code> for images</li>
                                    <li><code>@discussion</code> for discussions</li>
                                    <li>When you type a code, a menu will appear to help you choose what to link to.  If the menu is empty, it means nothing of that type exists yet.</li>
                                </ul>
                            </li>
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeSyntaxModal} color="secondary">OK</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

interface Props {
    classes?: any
}

interface State {
    syntaxModalOpen: boolean
}

const styles = (theme: Theme) => createStyles({
    formattingHelpText: {
        fontSize: '0.7rem',
        padding: '4px 8px 10px',

        '& a': {
            color: theme.palette.secondary.main,
            textDecoration: 'underline',
            cursor: 'pointer',
        },
    },
    dialog: {
        '& li': {
            marginBottom: 8,
        },
        '& pre': {
            margin: 0,
            backgroundColor: '#f3f3f3',
            paddingLeft: 11,
            marginBottom: 7,
            borderRadius: 4,
            '& code': {
                color: 'inherit',
            },
        },
        '& code': {
            color: '#d00707',
        },
    },
})

export default withStyles(styles)(FormattingHelp)
