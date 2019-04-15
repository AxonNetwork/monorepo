import React from 'react'
import Resizable from 're-resizable'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import RenderMarkdown from 'conscience-components/RenderMarkdown'
import SmartTextarea from 'conscience-components/SmartTextarea'
import { URI } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import OverlayScrollbars from 'overlayscrollbars'


@autobind
class MarkdownEditor extends React.Component<Props>
{
    _renderedWrapper: HTMLDivElement|null = null
    _textarea: any|null = null

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
                <div className={classes.columnContainer}>

                    <Resizable
                        defaultSize={{ width: '50%' }}
                        enable={{ right: true }}
                        handleClasses={{ right: classes.resizeHandle }}
                    >
                        <div className={classes.renderedWrapper} ref={x => this._renderedWrapper = x}>
                            <Card>
                                <CardContent classes={{ root: classes.cardContent }}>
                                    <RenderMarkdown
                                        uri={this.props.uri}
                                        text={this.props.value}
                                    />
                                </CardContent>
                            </Card>

                            {/* Need this or else the bottom of the card gets cut off, despite the padding.  Probably OverlayScrollbars' fault. */}
                            <div style={{ height: 6 }}></div>
                        </div>
                    </Resizable>

                    <div className={classes.textareaWrapper}>
                        <SmartTextarea
                            uri={this.props.uri}
                            value={this.props.value}
                            rows={1}
                            rowsMax={false}
                            variant="outlined"
                            autoFocus={this.props.autoFocus}
                            onChange={this.props.onChange}
                            InputProps={{
                                margin: 'none',
                                classes: {
                                    root: classes.textareaRoot,
                                    inputMultiline: classes.textareaRoot,
                                },
                            }}
                            classes={{ root: classes.textareaRoot }}
                            textFieldClasses={{ root: classes.textareaRoot }}
                            innerRef={x => this._textarea = x}
                        />
                    </div>

                </div>
            </div>
        )
    }

    componentDidMount() {
        const options = {
            className: 'os-theme-dark',
            autoUpdate: true,
            autoUpdateInterval: 1000,
            scrollbars: {
                autoHide: 'scroll',
                autoHideDelay: 800,
            },
            overflowBehavior: {
                x: 'hidden',
                y: 'auto'
            },
        }
        OverlayScrollbars(this._renderedWrapper, options)
        // OverlayScrollbars(this._textarea, options)
    }

    onChangeText = (currentContents: string) => {
        this.setState({ currentContents })
    }
}

interface Props {
    uri: URI
    value: string
    autoFocus?: boolean
    onChange: (value: string) => void
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 222px)',
        paddingBottom: 30,
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    columnContainer: {
        display: 'flex',
        flexGrow: 1,
        height: '100%',
    },
    textareaWrapper: {
        flexGrow: 1,
        width: '50%',
        height: '100%',

        '& textarea': {
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.9rem',
        },
    },
    renderedWrapper: {
        flexGrow: 1,
        // width: '50%',
        height: '100%',
        overflowY: 'auto',
        padding: 4,
        marginRight: 30,
    },
    cardContent: {
        padding: 32,
    },
    textareaRoot: {
        height: '100%',
    },
    resizeHandle: {
        position: 'absolute',
        userSelect: 'none',
        width: '20px !important',
        height: '100%',
        top: 0,
        right: '2px !important',
        cursor: 'col-resize',
    },
})

export default withStyles(styles)(MarkdownEditor)