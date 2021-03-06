import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import MarkdownEditor from 'conscience-components/MarkdownEditorNoLinks'
import { updateOrg } from 'conscience-components/redux/org/orgActions'
import { IOrganization } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgEditorPage extends React.Component<Props>
{
    render() {
        const { org, classes } = this.props
        const defaultReadme = `# ${org.name}\n\nWrite some instructions or a welcome message here to help others understand the work that you're doing.  Markdown syntax is fully supported.  When you're done, just click the save button.`
        const readme = org.readme.length > 0 ? org.readme : defaultReadme

        return (
            <div className={classes.editorPage}>
                <MarkdownEditor
                    defaultContents={readme}
                    isSaving={this.props.updateOrgLoading}
                    handleSave={this.onSave}
                    handleClose={this.onClose}
                />
            </div>
        )
    }

    onSave(readme: string) {
        const orgID = this.props.org.orgID
        this.props.updateOrg({ orgID, readme })
    }

    onClose() {
        const orgID = this.props.match.params.orgID
        this.props.history.push(`/org/${orgID}`)
    }

    componentWillReceiveProps(props: Props) {
        if (this.props.updateOrgLoading && !props.updateOrgLoading) {
            const orgID = this.props.match.params.orgID
            this.props.history.push(`/org/${orgID}`)
        }
    }
}

type Props = OwnProps & StateProps & DispatchProps & { classes: any }

interface MatchParams {
    orgID: string
}

interface OwnProps extends RouteComponentProps<MatchParams> { }

interface StateProps {
    org: IOrganization
    updateOrgLoading: boolean
}

interface DispatchProps {
    updateOrg: typeof updateOrg
}

const styles = (theme: Theme) => createStyles({})

interface IPartialState {
    org: {
        orgs: { [orgID: string]: IOrganization }
    }
}

const mapStateToProps = (state: IPartialState, props: RouteComponentProps<MatchParams>) => {
    const orgID = props.match.params.orgID
    const org = state.org.orgs[orgID]
    return {
        org,
        updateOrgLoading: false,
    }
}

const mapDispatchToProps = {
    updateOrg,
}

export default connect<StateProps, DispatchProps, OwnProps, IPartialState>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrgEditorPage))