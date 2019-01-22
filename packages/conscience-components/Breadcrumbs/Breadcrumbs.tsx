import path from 'path'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import classnames from 'classnames'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { FileMode, URI, URIType } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { selectFile } from 'conscience-components/navigation'


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

        selectFile(this.props.history, { ...this.props.uri, filename }, FileMode.View)
    }

    getParts() {
        let parts: string[]

        if (this.props.uri.type === URIType.Local) {
            parts = [path.basename(this.props.uri.repoRoot)]
        } else {
            parts = [this.props.uri.repoID]
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
                <span>Location: </span>
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
            </Typography>
        )
    }
}

type Props = OwnProps & RouteComponentProps<{}>

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
})

export default withStyles(styles)(withRouter(Breadcrumbs))

