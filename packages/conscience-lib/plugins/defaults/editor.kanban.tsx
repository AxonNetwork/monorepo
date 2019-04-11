import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import React from 'react'
import KanbanBoard from 'react-trello'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import toml from 'toml-j0.4'
import tomlify from 'tomlify-j0.4'
import autobind from 'conscience-lib/utils/autobind'
import { URI, FileMode } from 'conscience-lib/common'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import * as filetypes from 'conscience-lib/utils/fileTypes'
import { getFileContents, saveFileContents } from 'conscience-components/env-specific'
import { selectFile } from 'conscience-components/navigation'

import Popover from '@terebentina/react-popover'

@autobind
class KanbanPlugin extends React.Component<Props>
{
    state = {
        fileContents: null,
        data: { lanes: [] as any[] },
        showEditLaneTitleModalForLane: null as string|null,
    }

    _inputEditLaneTitle: HTMLInputElement|null = null

    render() {
        const { fileContents, data } = this.state
        if (fileContents === null) {
            return <LargeProgressSpinner />
        }

        let currentlyEditingLane: any
        for (let lane of this.state.data.lanes) {
            if (lane.id === this.state.showEditLaneTitleModalForLane) {
                currentlyEditingLane = lane
                break
            }
        }

        const { classes } = this.props

        return (
            <div>
                <KanbanBoard
                    draggable
                    editable
                    canAddLanes
                    data={data}
                    onDataChange={this.onDataChange}
                    style={{ height: 'fit-content' }}
                    customLaneHeader={<LaneHeader onClickEditLaneTitle={this.showEditLaneTitleModal} />}
                />

                <EditLaneTitleDialog
                    open={!!this.state.showEditLaneTitleModalForLane}
                    currentTitle={currentlyEditingLane ? currentlyEditingLane.title : null}
                    onClose={this.onCloseEditLaneTitleModal}
                />
            </div>
        )
    }

    showEditLaneTitleModal = (laneId: string) => {
        this.setState({ showEditLaneTitleModalForLane: laneId })
    }

    onCloseEditLaneTitleModal = (title: string|null) => {
        if (title === null) {
            this.setState({ showEditLaneTitleModalForLane: null })
            return
        }

        const laneId = this.state.showEditLaneTitleModalForLane
        for (let lane of this.state.data.lanes) {
            if (lane.id === laneId) {
                lane.title = title
            }
        }
        this.onDataChange(this.state.data)
        this.setState({ data: this.state.data, showEditLaneTitleModalForLane: null })
    }

    componentDidMount() {
        if (!this.props.isNewFile) {
            this.updateFileContents()
        } else {
            this.setState({ fileContents: '' })
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(prevProps.uri, this.props.uri) && !this.props.isNewFile) {
            this.updateFileContents()
        }
    }

    async updateFileContents() {
        if (!this.props.uri.filename) {
            this.setState({ fileContents: null })
            return
        }

        // Don't handle binary files, only text
        if (!filetypes.isTextFile(this.props.uri.filename)) {
            this.setState({ fileContents: null })
            return
        }

        try {
            const fileContents = await getFileContents(this.props.uri)
            const data = this.deserialize(fileContents.toString())

            this.setState({ fileContents, data })
        } catch (error) {
            this.setState({ fileContents: null, data: { lanes: [] }, error })
        }
    }

    async saveFileContents(fileContents: string) {
        await saveFileContents(this.props.uri, fileContents)
        if (this.props.isNewFile) {
            selectFile(this.props.uri, FileMode.Edit)
        }
    }

    serialize = (data: any) => {
        const toSave = {} as any
        for (let lane of data.lanes) {
            toSave[lane.title] = (lane.cards || []).map((card: any) => omit(card, 'id', 'laneId'))
        }

        return tomlify.toToml(toSave, { space: 0 }) as string
    }

    deserialize = (fileContents: string) => {
        try {
            const rawData = toml.parse(fileContents.toString()) as any
            const data = { lanes: [] as any[] }
            for (let laneTitle of Object.keys(rawData)) {
                const cards = (rawData[laneTitle] || []).map((card: any) => ({ ...card, id: card.title, laneId: laneTitle }))
                data.lanes.push({
                    id: laneTitle,
                    title: laneTitle,
                    // label: '2/2',
                    cards,
                })
            }
            return data
        } catch (err) {
            console.error(err)
            return { lanes: [] }
        }
    }

    onDataChange = (data: any) => {
        this.saveFileContents(this.serialize(data))
    }

}

type Props = OwnProps & { classes: any }

interface OwnProps {
    uri: URI
    isNewFile: boolean
    setFileModified: (modified: boolean) => void
}

interface State {
    fileContents: string
    data: any
}

const styles = () => createStyles({
    laneHeader: {
        // marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '0px 5px',
        marginBottom: 0,
    },
    laneTitle: {
        fontWeight: 'bold',
        fontSize: '15px',
        lineHeight: '18px',
        cursor: 'grab',
        width: '70%',
    },
    laneLabel: {
        width: '30%',
        textAlign: 'right',
        paddingRight: 10,
        fontSize: '13px',
    },
    laneMenuHeader: {
        position: 'relative',
        marginBottom: 4,
        textAlign: 'center',
    },
    laneMenuContent: {
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: '0 12px 12px',
    },
    laneMenuItem: {
        cursor: 'pointer',
        display: 'block',
        fontWeight: 700,
        padding: '6px 12px',
        position: 'relative',
        margin: '0 -12px',
        textDecoration: 'none',

        '&:hover': {
            backgroundColor: '#3179BA',
            color: '#fff',
        },
    },
    laneMenuTitle: {
        boxSizing: 'border-box',
        color: '#6b808c',
        display: 'block',
        lineHeight: '30px',
        borderBottom: '1px solid rgba(9,45,66,.13)',
        margin: '0 6px',
        overflow: 'hidden',
        padding: '0 32px',
        position: 'relative',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        zIndex: 1,
    },
    laneMenuDeleteWrapper: {
        textAlign: 'center',
        position: 'absolute',
        top: -1,
        right: 2,
        cursor: 'pointer',
    },
    laneMenuDeleteButton: {
        transition: 'all 0.5s ease',
        display: 'inline-block',
        border: 'none',
        fontSize: '15px',
        height: '15px',
        padding: 0,
        marginTop: 5,
        textAlign: 'center',
        width: '15px',
        background: 'inherit',
        cursor: 'pointer',
    },
    laneMenuButton: {
        transition: 'all 0.5s ease',
        display: 'inline-block',
        border: 'none',
        outline: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        height: 15,
        lineHeight: '1px',
        margin: '0 0 8px',
        padding: 0,
        textAlign: 'center',
        width: '15px',
        background: 'inherit',
        cursor: 'pointer',
    }
})

const LaneHeader = withStyles(styles)(function(props: any) {
    const { classes, actions, title, label, id, onClickEditLaneTitle } = props
    return (
        <div className={classes.laneHeader}>
            <div className={classes.laneTitle}>{title}</div>
            <div className={classes.laneLabel}>{label}</div>

            <Popover className="menu" position="bottom" trigger={<div className={classes.laneMenuButton}>⋮</div>}>
                <div className={classes.laneMenuHeader}>
                    <div className={classes.laneMenuTitle}>Lane actions</div>
                    <div className={classes.laneMenuDeleteWrapper}>
                        <div className={classes.laneMenuDeleteButton}>&#10006;</div>
                    </div>
                </div>
                <div className={classes.laneMenuContent}>
                    <div className={classes.laneMenuItem} onClick={() => onClickEditLaneTitle(id)}>Edit title...</div>
                    <div className={classes.laneMenuItem} onClick={() => actions.removeLane({ laneId: id })}>Delete lane...</div>
                </div>
            </Popover>
        </div>
    )
})

class EditLaneTitleDialog extends React.Component<{
    open: boolean
    currentTitle: string|null
    onClose: (newTitle: string|null) => void
}>
{
    _inputEditLaneTitle: HTMLInputElement|null = null

    render() {
        return (
            <Dialog open={this.props.open} onClose={() => this.props.onClose(this.props.currentTitle)}>
                <DialogTitle>Edit lane title</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth autoFocus
                        defaultValue={this.props.currentTitle || ''}
                        inputRef={x => this._inputEditLaneTitle = x}
                        inputProps={{
                            onKeyDown: this.onKeyDown,
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onClickSave}   color="secondary" variant="contained">Save</Button>
                    <Button onClick={this.onClickCancel} color="secondary" variant="outlined">Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }

    onKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === 'Enter') {
            evt.stopPropagation()
            this.onClickSave()
        }
    }

    onClickSave   = () => this.props.onClose(this._inputEditLaneTitle!.value)
    onClickCancel = () => this.props.onClose(this.props.currentTitle)
}


export default {
    pluginType: 'file editor',
    name: 'kanban-editor',
    humanName: 'Kanban board',
    editor: withStyles(styles)(KanbanPlugin),
    showSaveButton: false,
}
