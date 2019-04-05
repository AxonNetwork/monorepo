import React from 'react'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { URIType, RepoPage, IFeaturedRepo } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { H5 } from 'conscience-components/Typography/Headers'
import { selectRepo } from 'conscience-components/navigation'
const logo = require('../../../assets/logo-placeholder.png')


@autobind
class FeaturedRepoCard extends React.Component<Props>
{
    render() {
        const { repoInfo, canEdit, classes } = this.props
        const image = repoInfo.image || logo

        return (
            <Card className={classes.card} onClick={this.selectRepo}>
                {canEdit &&
                    <div className={classes.buttonRow}>
                        <IconButton onClick={this.onEdit}>
                            <EditIcon fontSize='small' />
                        </IconButton>
                        <IconButton onClick={this.onDelete}>
                            <DeleteIcon fontSize='small' />
                        </IconButton>
                    </div>
                }
                <CardMedia className={classes.media}>
                    <img src={image} />
                </CardMedia>
                <CardContent className={classes.content}>
                    <H5>{repoInfo.title}</H5>
                    <div>{repoInfo.description}</div>
                </CardContent>
            </Card>
        )
    }

    onEdit() {
        this.props.onEdit(this.props.repoInfo.repoID)
    }

    onDelete() {
        this.props.onDelete(this.props.repoInfo.repoID)
    }

    selectRepo() {
        if (this.props.canEdit) {
            return
        }
        selectRepo({ type: URIType.Network, repoID: this.props.repoInfo.repoID }, RepoPage.Home)
    }
}

interface Props {
    repoInfo: IFeaturedRepo
    canEdit?: boolean
    onEdit: (repoID: string) => void
    onDelete: (repoID: string) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    card: {
        marginBottom: 32,
        height: 'calc(100% - 32px)',
        position: 'relative',
        cursor: 'pointer',
    },
    buttonRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    media: {
        maxHeight: 150,
        overflow: 'hidden',
        "& img": {
            width: '100%'
        }
    },
    content: {
        // marginBottom: 40
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        '& button': {
            textTransform: 'none'
        }
    },
})

export default withStyles(styles)(FeaturedRepoCard)