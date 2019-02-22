import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import LinkIcon from '@material-ui/icons/Link'
import { selectCommit } from '../navigation'
import { fetchSecuredFileInfo } from '../redux/repo/repoActions'
import { IGlobalState } from '../redux'
import { URI, ISecuredTextInfo, IRepoMetadata, ITimelineEvent, IUpdatedRefEvent } from 'conscience-lib/common'
import { uriToString } from 'conscience-lib/utils'
import moment from 'moment'
import isEqual from 'lodash/isEqual'

const DATE_FORMAT = 'MMM Do YYYY, h:mm a'

class SecuredText extends React.Component<Props, State>
{
    state = {
        lastVerified: undefined as ITimelineEvent | undefined,
        firstVerified: undefined as ITimelineEvent | undefined,
        lastUpdated: undefined as ITimelineEvent | undefined,
    }

    componentDidMount() {
        if (this.props.uri.filename !== undefined) {
            this.props.fetchSecuredFileInfo({ uri: this.props.uri })
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!isEqual(this.props.uri, prevProps.uri) && this.props.uri.filename !== undefined) {
            this.props.fetchSecuredFileInfo({ uri: this.props.uri })
        }
    }

    selectCommit(commit: string) {
        selectCommit({ ...this.props.uri, commit })
    }

    render() {
        let info = {} as ISecuredTextInfo
        const { uri, commits, metadata, securedFileInfo, classes } = this.props
        if (!uri.commit && !uri.filename && !!metadata) {
            // if repo
            const { firstVerifiedTime, firstVerifiedCommit, lastVerifiedTime, lastVerifiedCommit } = metadata
            info = { firstVerifiedTime, firstVerifiedCommit, lastVerifiedTime, lastVerifiedCommit } as ISecuredTextInfo
        } else if (uri.commit && !uri.filename) {
            // if commit
            const commit = commits[uri.commit]
            info.lastVerifiedCommit = commit.lastVerifiedCommit
            info.lastVerifiedTime = commit.lastVerifiedTime
        } else if (uri.filename) {
            // if file
            info = securedFileInfo || {}
        }

        if (Object.keys(info).length === 0) {
            return null
        }

        return (
            <div className={classnames(classes.securedContainer, classes.root)}>
                <div className={classes.iconContainer}>
                    <LinkIcon />
                </div>
                <div>
                    {info.lastModifiedCommit !== undefined &&
                        <Typography>
                            <span>Last updated </span>
                            <a href="#" className={classes.link} onClick={() => this.selectCommit(info.lastModifiedCommit || '')}>
                                {moment(info.lastModifiedTime).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                    {info.lastVerifiedCommit !== undefined &&
                        <Typography>
                            {uri.filename === undefined &&
                                <span>This commit secured </span>
                            }
                            {uri.filename !== undefined &&
                                <span>Last secured </span>
                            }
                            <a href="#" className={classes.link} onClick={() => this.selectCommit(info.lastVerifiedCommit || '')}>
                                {moment(info.lastVerifiedTime).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                    {info.firstVerifiedCommit !== undefined &&
                        <Typography>
                            <span>First secured </span>
                            <a href="#" className={classes.link} onClick={() => this.selectCommit(info.firstVerifiedCommit || '')}>
                                {moment(info.firstVerifiedTime).format(DATE_FORMAT)}
                            </a>
                        </Typography>
                    }
                </div>
            </div>
        )
    }
}

interface State {
    lastVerified: ITimelineEvent | undefined
    firstVerified: ITimelineEvent | undefined
    lastUpdated: ITimelineEvent | undefined
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface OwnProps {
    uri: URI
    classes?: any
}

interface StateProps {
    commits: { [hash: string]: ITimelineEvent }
    commitList: string[]
    updatedRefEventsByCommit: { [commit: string]: IUpdatedRefEvent }
    metadata: IRepoMetadata | null | undefined
    securedFileInfo: ISecuredTextInfo | undefined
}

interface DispatchProps {
    fetchSecuredFileInfo: typeof fetchSecuredFileInfo
}

const styles = (theme: Theme) => createStyles({
    root: {},
    securedContainer: {
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        marginTop: theme.spacing.unit,
    },
    iconContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: theme.spacing.unit,
    },
    link: {
        color: theme.palette.secondary.main,
    },
})

const mapStateToProps = (state: IGlobalState, ownProps: OwnProps) => {
    const uriStr = uriToString(ownProps.uri)
    const commitList = state.repo.commitListsByURI[uriStr] || []
    return {
        commits: state.repo.commits || {},
        commitList,
        updatedRefEventsByCommit: state.repo.updatedRefEventsByCommit,
        metadata: state.repo.metadataByURI[uriStr],
        securedFileInfo: state.repo.securedFileInfoByURI[uriStr],
    }
}

const mapDispatchToProps = {
    fetchSecuredFileInfo
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SecuredText))
