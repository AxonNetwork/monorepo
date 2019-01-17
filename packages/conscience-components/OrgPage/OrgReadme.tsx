import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import LargeAddButton from 'conscience-components/LargeAddButton'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import ReactMarkdown from 'react-markdown'


class OrgReadme extends React.Component<Props>
{
    render() {
        const { readme, classes } = this.props
        const hasReadme = readme && readme.length > 0

        return (
            <div className={classes.root}>
                {!hasReadme &&
                    <LargeAddButton
                        text="Click to add a welcome message for your team"
                        onClick={this.props.onClickEditReadme}
                    />
                }
                {hasReadme &&
                    <Card className={classes.readmeCard}>
                        <IconButton
                            onClick={this.props.onClickEditReadme}
                            className={classes.editButton}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <CardContent className={classes.readmeWrapper}>
                            <ReactMarkdown source={readme} />
                        </CardContent>
                    </Card>
                }
            </div>
        )
    }
}

interface Props {
    readme?: string | undefined
    onClickEditReadme: () => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {},
    readmeCard: {
        marginBottom: 32,
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    readmeWrapper: {
        padding: '24px 44px 44px',

        '& code': {
            backgroundColor: '#f5f5f5',
            color: '#d00707',
            padding: '2px 3px',
            borderRadius: 2,
            fontFamily: 'Consolas, Menlo, Monaco, "Courier New", Courier, monospace',
            fontSize: '0.8rem',
        },
        '& pre code': {
            color: 'inherit',
            backgroundColor: 'inherit',
            padding: 'inherit',
            borderRadius: 'unset',
        },
        '& img': {
            display: 'block',
            margin: '30px auto',
        },
    },
})

export default withStyles(styles)(OrgReadme)
