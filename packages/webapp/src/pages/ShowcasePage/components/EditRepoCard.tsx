import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import FormHelperText from '@material-ui/core/FormHelperText'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { H6 } from 'conscience-components/Typography/Headers'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { URIType, IRepoFile, IFeaturedRepo } from 'conscience-lib/common'
import { autobind, uriToString } from 'conscience-lib/utils'
import { IGlobalState } from 'conscience-components/redux'
import * as filetypes from 'conscience-lib/utils/fileTypes'
const logo = require('../../../assets/logo-placeholder.png')


@autobind
class EditRepoCard extends React.Component<Props, State>
{
    _inputTitle: HTMLInputElement | null = null
    _inputDescription: HTMLInputElement | null = null
    _inputImage: HTMLInputElement | null = null

    state = {
        dialogOpen: false,
        image: undefined,
        missing: undefined,
    }

    render() {
        const { repoInfo, classes } = this.props
        const { missing } = this.state
        const images = Object.keys(this.props.files).filter(name => filetypes.getType(name) === 'image')
        const image = this.state.image || repoInfo.image || logo

        return (
            <Card className={classes.card}>
                <div className={classes.buttonRow}>
                    <IconButton onClick={this.saveRepoCard} >
                        <SaveIcon fontSize='small' />
                    </IconButton>
                    <IconButton onClick={this.onCancel} >
                        <CancelIcon fontSize='small' />
                    </IconButton>
                </div>
                <CardActionArea onClick={this.openDialog}>
                    <CardMedia className={classes.media}>
                        <img src={image} />
                    </CardMedia>
                </CardActionArea>
                <CardContent>
                    <TextField
                        label="Title"
                        defaultValue={repoInfo.title}
                        fullWidth
                        error={missing === 'title'}
                        inputRef={x => this._inputTitle = x}
                    />
                    <TextField
                        label="Description"
                        defaultValue={repoInfo.description}
                        fullWidth
                        error={missing === 'description'}
                        inputRef={x => this._inputDescription = x}
                        multiline
                        rows={3}
                    />
                    {missing !== undefined &&
                        <FormHelperText error>
                            Please add a {missing}
                        </FormHelperText>
                    }
                </CardContent>
                <Dialog onClose={this.closeDialog} open={this.state.dialogOpen}>
                    <DialogTitle>
                        Select an image
					</DialogTitle>
                    {images.length === 0 &&
                        <DialogContent>
                            <DialogContentText>
                                There are no images in this repository
							</DialogContentText>
                        </DialogContent>
                    }
                    <List className={classes.imageList}>
                        {images.map(name => (
                            <ListItem
                                button
                                onClick={() => this.selectImage(name)}
                            >
                                <ListItemText primary={name} />
                            </ListItem>
                        ))}
                    </List>
                    <DialogContent className={classes.imageForm}>
                        <Divider />
                        <H6>Or paste an image url</H6>
                        <form onSubmit={this.addImageUrl}>
                            <TextField
                                label="ImageUrl"
                                fullWidth
                                inputRef={x => this._inputImage = x}
                            />
                            <Button
                                type="submit"
                                variant="outlined"
                                color="secondary"
                                className={classes.button}
                            >
                                Save Image
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Card>
        )
    }

    saveRepoCard() {
        const repoInfo = this.props.repoInfo
        const title = this._inputTitle !== null ? this._inputTitle.value : ''
        const description = this._inputDescription !== null ? this._inputDescription.value : ''

        if (title.length === 0) {
            this.setState({ missing: 'title' })
            return
        }
        if (description.length === 0) {
            this.setState({ missing: 'description' })
            return
        }

        const newInfo = {
            repoID: repoInfo.repoID,
            title,
            description,
            image: this.state.image || repoInfo.image
        }
        this.props.onSave(newInfo)
    }

    openDialog() {
        this.setState({ dialogOpen: true })
    }

    closeDialog() {
        this.setState({ dialogOpen: false })
    }

    onCancel() {
        this.props.onCancel(this.props.repoInfo.repoID)
    }

    selectImage(imgName: string) {
        const API_URL = process.env.API_URL
        const image = `${API_URL}/repo/${this.props.repoInfo.repoID}/file/HEAD/${imgName}`
        this.setState({ image })
        this.closeDialog()
    }

    addImageUrl(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (this._inputImage === null) {
            return
        }
        const image = this._inputImage.value
        this.setState({ image })
        this.closeDialog()
    }
}

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    repoInfo: IFeaturedRepo
    onSave: (info: IFeaturedRepo) => void
    onCancel: (repoID: string) => void
}

interface StateProps {
    files: { [filename: string]: IRepoFile }
}

interface State {
    dialogOpen: boolean
    image: string | undefined
    missing: string | undefined
}

const styles = (theme: Theme) => createStyles({
    card: {
        marginBottom: 32,
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
    actions: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    imageList: {
        maxHeight: 400,
        overflowY: 'scroll'
    },
    imageForm: {
        paddingTop: 16
    },
    button: {
        textTransform: 'none',
        marginTop: 16,
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const uriStr = uriToString({ type: URIType.Network, repoID: ownProps.repoInfo.repoID })
    return {
        files: state.repo.filesByURI[uriStr] || {},
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(EditRepoCard))