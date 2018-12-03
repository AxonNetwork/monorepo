import React from 'react'
import { Theme, withStyles, createStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import classnames from 'classnames'
import Repositories from './elements/Repositories'
import Members from './elements/Members'
import RenderMarkdown from 'components/RenderMarkdown/RenderMarkdown'
import { IOrganization } from 'common'
import autobind from 'utils/autobind'
import { OrgPage } from 'redux/org/orgReducer'

@autobind
class OrganizationHomePage extends React.Component<Props>
{
    render() {
        const { org, classes } = this.props
        const hasReadme = org.readme && org.readme.length > 0
        return(
            <div className={classes.organizationHomePage}>
                <div className={classes.boxes}>
                    {!hasReadme &&
                        <div className={classes.noReadmeContainer}>
                            <div className={classes.noReadmeContents} onClick={this.onClickEditReadme}>
                                <Typography className={classes.noReadmeText}>
                                    Click to add a welcome message for your team
                                </Typography>

                                <AddCircleOutlineIcon className={classes.noReadmeAddIcon} />
                            </div>
                        </div>
                    }
                    {hasReadme &&
                        <Card className={classes.readmeBox}>
                            <IconButton
                                onClick={this.onClickEditReadme}
                                className={classes.editButton}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <CardContent>
                                <RenderMarkdown
                                    text={org.readme}
                                    basePath=""
                                />
                            </CardContent>
                        </Card>
                    }
                    <Repositories classes={{root: classes.box}} />
                </div>
                <Members classes={{root: classnames(classes.box, classes.membersBox)}} />
            </div>
        )
    }

    onClickEditReadme() {
        this.props.navigateOrgPage({ orgPage: OrgPage.Editor })
    }
}

interface Props {
    org: IOrganization
    navigateOrgPage: Function
    classes: any
}

const styles = (theme: Theme) => createStyles({
    organizationHomePage: {
        width: '100%',
        display: 'flex',
    },
    boxes: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        marginRight: 30,
    },
    box: {
        marginRight: theme.spacing.unit * 3,
    },
    readmeBox: {
        position: 'relative',
        marginBottom: theme.spacing.unit * 3,
    },
    editButton: {
        position: 'absolute',
        right: 0,
    },
    membersBox: {
        minWidth: 260,
        flexGrow: 1,
        // marginRight: theme.spacing.unit * 6,
    },
    noReadmeContainer: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        border: '3px solid #c5c5c5',
        padding: 30,
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: theme.spacing.unit * 3,
    },
    noReadmeContents: {
        position: 'relative',
        top: '15%',
    },
    noReadmeText: {
        fontSize: '1.2rem',
        color: '#a2a2a2',
        fontWeight: 700,
        marginBottom: 20,
    },
    noReadmeAddIcon: {
        fontSize: '5rem',
        color: '#a2a2a2',
    },
})

export default withStyles(styles)(OrganizationHomePage)