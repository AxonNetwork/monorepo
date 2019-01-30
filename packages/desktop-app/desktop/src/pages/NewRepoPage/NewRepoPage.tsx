import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import CircularProgress from '@material-ui/core/CircularProgress'
import { H5, H6 } from 'conscience-components/Typography/Headers'
import SharedReposList from 'conscience-components/SharedReposList'
import ImportRepoButton from 'conscience-components/ImportRepoButton'
import { IGlobalState } from 'conscience-components/redux'
import { initRepo } from 'conscience-components/redux/repo/repoActions'
import { IOrganization } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class NewRepoPage extends React.Component<Props, State>
{
    _inputRepoID: HTMLInputElement | null = null

    state = {
        orgID: '',
    }

    render() {
        const { orgs, classes } = this.props
        return (
            <div className={classes.root}>
                <H5 className={classes.pageTitle}>Add a repository</H5>

                <div className={classes.contentArea}>
                    <div className={classes.contentAreaInner}>
                        <div className={classes.cardContainer}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <H6>Create a new repository</H6>
                                    <form noValidate autoComplete="off" name="create" onSubmit={this.handleSubmit}>
                                        <TextField
                                            id="repo-id"
                                            label="Repository ID"
                                            fullWidth
                                            inputRef={x => this._inputRepoID = x}
                                        />
                                        <FormControl className={classes.selectContainer}>
                                            <InputLabel>
                                                Organization
                                            </InputLabel>
                                            <Select
                                                value={this.state.orgID}
                                                onChange={this.handleSelectChange}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {Object.keys(orgs).map(orgID => (
                                                    <MenuItem value={orgID}>{orgs[orgID].name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="raised"
                                            color="secondary"
                                            className={classes.button}
                                            disabled={this.props.createRepoLoading}
                                            type="submit"
                                        >
                                            Create
                                            {this.props.createRepoLoading && <CircularProgress size={24} className={classes.buttonLoading} />}
                                        </Button>
                                    </form>
                                    <Divider className={classes.divider} />
                                    <H6>Or import an existing repository</H6>
                                    <ImportRepoButton
                                        orgs={orgs}
                                        importRepoLoading={this.props.importRepoLoading}
                                        onImport={this.onImport}
                                        classes={{ root: classes.button }}
                                    />

                                </CardContent>
                            </Card>

                            <Card className={classes.card}>
                                <CardContent>
                                    <SharedReposList />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onImport(repoID: string, path: string, orgID: string) {
        this.props.initRepo({ repoID, path, orgID })
        console.log(path)
    }

    componentWillMount() {
        this.setState({ orgID: this.props.match.params.orgID || '' })
    }

    handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ orgID: event.target.value || '' })
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (this._inputRepoID === null || this._inputRepoID.value === '') {
            return
        }
        const repoID = this._inputRepoID.value
        const orgID = this.state.orgID
        this.props.initRepo({ repoID, orgID })
    }
}

interface State {
    orgID: string | undefined
}

interface MatchParams {
    orgID?: string
}

interface Props extends RouteComponentProps<MatchParams> {
    orgs: { [orgID: string]: IOrganization }
    createRepoLoading: boolean
    importRepoLoading: boolean
    initRepo: typeof initRepo
    classes: any
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
        overflowY: 'auto',
        flexGrow: 1,
    },
    contentAreaInner: {
        marginTop: theme.spacing.unit * 4,
        marginRight: theme.spacing.unit * 4,
    },
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    card: {
        width: 500,
        margin: 16,
    },
    button: {
        display: 'block',
        marginTop: 16,
    },
    buttonLoading: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    selectContainer: {
        width: '100%',
        marginTop: 16
    },
    divider: {
        marginTop: 16,
        marginBottom: 16,
    }
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    return {
        orgs: state.org.orgs,
        createRepoLoading: state.ui.createRepoLoading,
        importRepoLoading: state.ui.importRepoLoading,
    }
}

const mapDispatchToProps = {
    initRepo
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(NewRepoPage))
