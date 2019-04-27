import path from 'path'
import fs from 'fs'
import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import ReactMarkdown from 'react-markdown'

import { IGlobalState } from 'conscience-components/redux'
import { autobind } from 'conscience-lib/utils'
import UserData from 'lib/UserData'

const appPath = require('electron').remote.app.getAppPath()
const changelogPath = process.env.NODE_ENV === 'development'
    ? path.join(appPath, '..', '..', 'CHANGELOG.md')
    : path.join(appPath, '..', 'desktop', 'dist-bundle', 'prod', 'CHANGELOG.md')


@autobind
class ChangelogDialog extends React.Component<Props, State>
{
    state = {
        show: false,
        changelogContents: '',
    }

    async componentDidMount() {
        const seenVersion = (await UserData.getMostRecentChangelogSeen()) || ''

        let show = false
        if (!seenVersion) {
            show = true
        } else {
            const seenVersionParts = seenVersion.split('.').map(n => parseInt(n, 10))
            const currentVersionParts = (process.env.APP_VERSION || '').split('.').map(n => parseInt(n, 10))

            const comparison = compareSemvers(seenVersionParts, currentVersionParts)
            if (comparison === undefined) {
                UserData.setMostRecentChangelogSeen(undefined)
                show = true
            } else {
                show = (comparison === 1)
            }
        }

        if (show) {
            try {
                const changelogContents = fs.readFileSync(changelogPath, 'utf8')
                this.setState({ show: true, changelogContents })
                UserData.setMostRecentChangelogSeen(process.env.APP_VERSION as string)

            } catch (err) {
                console.error('error reading CHANGELOG.md:', err)
            }
        }
    }

    render() {
        const { classes } = this.props
        return (
            <Dialog
                open={this.state.show}
                onClose={this.dismiss}
                aria-labelledby="changelog-dialog-title"
                PaperProps={{
                    classes: { root: classes.changelogDialogRoot }
                }}
            >
                <DialogTitle
                    id="changelog-dialog-title"
                    classes={{ root: classes.changelogDialogTitle }}
                >
                    Your app has been updated
                </DialogTitle>

                <DialogContent
                    classes={{ root: classes.changelogDialogContent }}
                >
                    <ReactMarkdown source={this.state.changelogContents} />
                </DialogContent>
            </Dialog>
        )
    }

    dismiss = () => {
        this.setState({ show: false })
    }
}

interface Props {
    classes: any
}

interface State {
    show: boolean
    changelogContents: string
}

const styles = (theme: Theme) => createStyles({
    changelogDialogRoot: {
        width: 640,
        height: 400,
    },
    changelogDialogTitle: {
        backgroundColor: '#f1f1f1',
    },
    changelogDialogContent: {
        fontSize: '0.8rem',
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        autoupdateState: state.user.autoUpdateState,
    }
}

export default connect(mapStateToProps)(withStyles(styles)(ChangelogDialog))



function compareSemvers(a: number[], b: number[]): number|undefined {
    if (a.length !== 3 || b.length !== 3) {
        return undefined
    }

    if (a[0] > b[0]) {
        return -1
    } else if (a[0] < b[0]) {
        return 1
    }

    if (a[1] > b[1]) {
        return -1
    } else if (a[1] < b[1]) {
        return 1
    }

    if (a[2] > b[2]) {
        return -1
    } else if (a[2] < b[2]) {
        return 1
    }

    return 0
}

