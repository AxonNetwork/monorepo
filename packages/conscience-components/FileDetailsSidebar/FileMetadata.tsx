import path from 'path'
import isEqual from 'lodash/isEqual'
import React from 'react'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Button from '@material-ui/core/Button'
import toml from 'toml-j0.4'
import tomlify from 'tomlify-j0.4'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { IGlobalState } from 'conscience-components/redux'
import { getFileContents, saveFileContents } from 'conscience-components/env-specific'
import { H6 } from 'conscience-components/Typography/Headers'

@autobind
class FileMetadata extends React.Component<Props, State>
{
    state = {
        metadata: {} as {[key: string]: any},
    }

    _inputNewKey:   HTMLInputElement|null = null
    _inputNewValue: HTMLInputElement|null = null

    render() {
        const { classes } = this.props
        const { metadata } = this.state

        return (
            <div className={classes.root}>
                <H6>Metadata</H6>
                <Table>
                    <TableHead>
                        <TableRow classes={{ head: classes.tableRowHead }}>
                            <TableCell>Key</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>

                        {Object.keys(metadata).length === 0 &&
                            <TableRow>
                                <TableCell colSpan={2} className={classes.metadataNoneYet}>None yet.</TableCell>
                            </TableRow>
                        }
                    </TableHead>
                    <TableBody>
                        {Object.keys(metadata).map(key => (
                            <TableRow className={classes.row} classes={{ root: classes.tableRow }}>
                                <TableCell className={classes.columnKey} classes={{ root: classes.tableCellRoot }}>{key}</TableCell>
                                <TableCell classes={{ root: classes.tableCellRoot }}>{`${metadata[key]}`}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell classes={{ root: classes.tableCellRoot }} colSpan={2}>
                                <div style={{ display: 'flex', marginTop: 8 }}>
                                    <input ref={x => this._inputNewKey = x} />&nbsp;&nbsp;
                                    <input ref={x => this._inputNewValue = x} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button color="secondary" onClick={this.onClickAdd}>Add</Button></div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    }

    getMetadataFilename = () => {
        const dirname  = path.dirname(this.props.uri!.filename!)
        const basename = path.basename(this.props.uri!.filename!)
        return path.join(dirname, '.' + basename + '.meta')
    }

    onClickAdd = async () => {
        const key = this._inputNewKey!.value
        const val = this._inputNewValue!.value
        const metadata = { ...this.state.metadata, [key]: val }

        const fileContents = tomlify.toToml(metadata, { space: 0 })

        await saveFileContents({ ...this.props.uri!, filename: this.getMetadataFilename() }, fileContents)

        this._inputNewKey!.value = ''
        this._inputNewValue!.value = ''

        this.getFileMetadata()
    }

    getFileMetadata = async () => {
        if (!this.props.uri) {
            return
        }

        let metadata = {}
        try {
            const metadataContents = (await getFileContents({ ...this.props.uri, filename: this.getMetadataFilename() })).toString()
            metadata = toml.parse(metadataContents.toString()) as any
        } catch (err) {}

        this.setState({ metadata })
    }

    componentDidMount() {
        this.getFileMetadata()
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (!isEqual(this.props.uri, prevProps.uri)) {
            this.getFileMetadata()
        }
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI|undefined
}

interface StateProps {
}

interface DispatchProps {
}

interface State {
    metadata: {[key: string]: any}
}

const styles = (theme: Theme) => createStyles({
    root: {}, // for overriding
    columnKey: {
        fontWeight: 500,
    },
    addMetadataLabel: {
        marginTop: 10,
        marginBottom: 10,
    },
    deemphasize: {
        color: '#afafaf',
    },

    tableRow: {
        height: 28,
    },
    tableRowHead: {
        height: 28,

        '& th': {
            paddingLeft: 4,
            // borderBottom: 'none',
            fontWeight: 400,
        },
    },
    tableCellRoot: {
        padding: 4,
        borderBottom: 'none',
    },
    metadataNoneYet: {
        borderBottom: 'none',
    }
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    return {
    }
}

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(FileMetadata))
