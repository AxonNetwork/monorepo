import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FeedbackIcon from '@material-ui/icons/Feedback'
import { H5 } from 'conscience-components/Typography/Headers'
import { IGlobalState } from 'conscience-components/redux'
import ServerRelay from 'conscience-lib/ServerRelay'


class FeedbackPage extends React.Component<Props, State>
{
    state = {
        sendFeedbackError: null,
        showSendFeedbackSuccess: false,
    }

    _inputSubject: HTMLInputElement|null = null
    _inputMessage: HTMLInputElement|null = null

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
                <H5 className={classes.pageTitle}>Help + feedback</H5>

                <div className={classes.contentArea}>
                    <br />
                    <Card>
                        <CardHeader
                            avatar={<FeedbackIcon className={classes.feedbackIcon} />}
                            title="We'd love to hear from you!  Use this form to send us suggestions, to report bugs, or to ask for help."
                            titleTypographyProps={{
                                classes: {
                                    root: classes.formHeaderText,
                                },
                            }}
                            classes={{ root: classes.formHeader }}
                        />
                        <CardContent>
                            <div className={classes.formContainer}>
                                <TextField fullWidth label="Subject" className={classes.subjectField} inputRef={x => this._inputSubject = x} />
                                <TextField fullWidth multiline rows={4} label="Your message" className={classes.messageField} inputRef={x => this._inputMessage = x} />

                                <Button color="secondary" variant="contained" className={classes.sendButton} onClick={this.onClickSend}>Send</Button>

                                {this.state.showSendFeedbackSuccess &&
                                    <div className={classes.sendSuccessMessage}>
                                        Your message has been sent.  We'll be back in touch via email soon!
                                    </div>
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    onClickSend = async () => {
        const subject = this._inputSubject!.value
        const message = this._inputMessage!.value
        try {
            await ServerRelay.sendFeedbackEmail(subject, message)

            this.setState({ showSendFeedbackSuccess: true })
            this._inputSubject!.value = ''
            this._inputMessage!.value = ''

        } catch (err) {
            this.setState({ sendFeedbackError: err })
        }
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
}

interface StateProps {
}

interface DispatchProps {
}

interface State {
    sendFeedbackError: Error|null
    showSendFeedbackSuccess: boolean
}

const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    pageTitle: {
        fontSize: '2rem',
        color: 'rgba(0, 0, 0, 0.7)',
        borderBottom: '1px solid #e4e4e4',
        paddingBottom: 20,
    },
    contentArea: {
        marginRight: 32,
        marginTop: 32,
        maxWidth: 780,
        alignSelf: 'center',
    },
    formHeader: {
        backgroundColor: '#f1f1f1',
    },
    formHeaderText: {
        color: 'rgba(0, 0, 0, 0.7)',
        // margin: '2px 0 33px',
        fontSize: '0.8rem',
        fontWeight: 400,
    },
    feedbackIcon: {
        fill: 'rgba(0, 0, 0, 0.7)',
        width: 27,
        height: 27,
        verticalAlign: 'middle',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    subjectField: {
        marginBottom: 20,
    },
    messageField: {
        marginBottom: 20,
    },
    sendButton: {
        width: 'fit-content',
        alignSelf: 'flex-end',
    },
    sendSuccessMessage: {
        color: '#00ad00',
        fontSize: '0.8rem',
    },
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
)(withStyles(styles)(FeedbackPage))
