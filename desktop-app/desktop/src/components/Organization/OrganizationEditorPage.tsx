import React from 'react'
import { connect } from 'react-redux'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import MarkdownEditor from './elements/MarkdownEditor'
import { IOrganization } from 'common'
import autobind from 'utils/autobind'
import { navigateOrgPage, updateOrg } from 'redux/org/orgActions'
import { OrgPage } from 'redux/org/orgReducer'
import { IGlobalState } from 'redux/store'


@autobind
class OrganizationPage extends React.Component<Props>
{
    render(){
        const { org, classes } = this.props
        const defaultReadme = `# ${org.name}\n\nWrite some instructions or a welcome message here to help others understand the work that you're doing.  Markdown syntax is fully supported.  When you're done, just click the save button.`
        const readme = org.readme.length > 0 ? org.readme : defaultReadme

        return(
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
        this.props.navigateOrgPage({ orgPage: OrgPage.Home })
    }

    componentWillReceiveProps(props: Props){
        if(this.props.updateOrgLoading && !props.updateOrgLoading){
            this.props.navigateOrgPage({orgPage: OrgPage.Home})
        }
    }
}

interface Props {
    org: IOrganization
    updateOrgLoading: boolean
    navigateOrgPage: typeof navigateOrgPage
    updateOrg: typeof updateOrg
    classes: any
}

const styles = (theme: Theme) => createStyles({

})

const mapStateToProps = (state: IGlobalState) => {
    const selectedOrg = state.org.selectedOrg || ""
    const org = state.org.orgs[selectedOrg]
    const updateOrgLoading = state.ui.updateOrgLoading
    return {
        org,
        updateOrgLoading,
    }
}

const mapDispatchToProps = {
    navigateOrgPage,
    updateOrg,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(OrganizationPage))