import path from 'path'
import { Link } from 'react-router-dom'
import React from 'react'
import classnames from 'classnames'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { FileMode, URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { selectFile, getCommitURL } from 'conscience-components/navigation'


@autobind
class Breadcrumbs extends React.Component<Props>
{
    state = {
        showBasePath: false,
    }

    componentWillReceiveProps(props: Props) {
        if ((this.props.uri.type !== props.uri.type) ||
            (this.props.uri.type === URIType.Local && props.uri.type === URIType.Local && props.uri.repoRoot !== this.props.uri.repoRoot) ||
            (this.props.uri.type === URIType.Network && props.uri.type === URIType.Network && props.uri.repoID !== this.props.uri.repoID)) {
            this.setState({ showBasePath: false })
        }
    }

    showBasePath() {
        this.setState({ showBasePath: true })
    }

    selectCrumb(index: number) {
        let filename: string | undefined
        if (index === 0) {
            filename = undefined
        } else {
            filename = this.getParts().slice(1, index + 1).join('/')
        }

        selectFile({ ...this.props.uri, filename }, FileMode.View)
    }

    getParts() {
        let parts: string[]

        if (this.props.uri.type === URIType.Local) {
            parts = [path.basename(this.props.uri.repoRoot)]
        } else {
            if (this.props.uri.filename === undefined) {
                parts = []
            } else {
                parts = [this.props.uri.repoID]
            }
        }

        if (this.props.uri.filename !== undefined) {
            parts = parts.concat(this.props.uri.filename.split('/'))
        }
        return parts
    }

    render() {
        const { uri, classes } = this.props

        const basePath = uri.type === URIType.Local ? path.dirname(uri.repoRoot) : undefined
        const parts = this.getParts()

        return (
            <Typography className={classes.root}>
                <div>
                    {basePath && basePath !== '.' &&
                        <React.Fragment>
                            {!this.state.showBasePath &&
                                <span className={classes.crumb} onClick={this.showBasePath}>...</span>
                            }
                            {this.state.showBasePath &&
                                <span>{basePath.substring(1).split('/').join(' / ')}</span>
                            }
                            <span> / </span>
                        </React.Fragment>
                    }

                    {parts.map((p, i) => {
                        return (
                            <React.Fragment key={p + i}>
                                <span className={classnames({ [classes.crumb]: i < parts.length - 1 })} onClick={() => this.selectCrumb(i)}>
                                    {p}
                                </span>
                                {(i < parts.length - 1) &&
                                    <span> / </span>
                                }
                            </React.Fragment>
                        )
                    })}
                </div>
                {uri.commit !== 'HEAD' && uri.commit !== 'working' &&
                    <div>
                        <Link to={getCommitURL(uri)} className={classes.commitLink}>
                            <span >{uri.commit}</span>
                        </Link>
                    </div>
                }
            </Typography>
        )
    }
}

type Props = OwnProps

interface OwnProps {
    uri: URI
    classes: any
}

const styles = (theme: Theme) => createStyles({
    root: {},
    crumb: {
        color: theme.palette.secondary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    commitLink: {
        fontFamily: 'Consolas, Monaco, "Courier New", Courier, sans-serif',
        color: theme.palette.primary.main,
        '&:hover': {
            color: theme.palette.secondary.main,
        }
    },
})

export default withStyles(styles)(Breadcrumbs)

