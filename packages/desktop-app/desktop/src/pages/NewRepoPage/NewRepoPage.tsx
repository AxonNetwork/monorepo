import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { H4 } from 'conscience-components/Typography/Headers'
import SharedReposList from 'conscience-components/SharedReposList'
import { IGlobalState } from 'conscience-components/redux'
import { createRepo } from 'conscience-components/redux/repo/repoActions'
import { IOrganization } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class NewRepositoryPage extends React.Component<Props, State>
{
    _inputRepoID: HTMLInputElement | null = null

    state = {
        orgID: ''
    }

    render() {
        const { orgs, classes } = this.props
        return (
            <Grid container spacing={24}>
                <Grid item className={classes.column} xs={12} sm={6}>
                    <H4>Create New Repository</H4>
                    <form noValidate autoComplete="off" name="create" onSubmit={this.handleSubmit} className={classes.form}>
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
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
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
                </Grid>
                <Grid item className={classes.column} xs={12} sm={6}>
                    <SharedReposList />
                </Grid>
            </Grid>
        )
    }

    componentWillMount() {
        this.setState({ orgID: this.props.match.params.orgID || '' })
    }

    handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ orgID: this.props.match.params.orgID || '' })
    }

    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (this._inputRepoID === null || this._inputRepoID.value === '') {
            return
        }
        const repoID = this._inputRepoID.value
        const orgID = this.state.orgID
        this.props.createRepo({ repoID, orgID })
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
    createRepo: typeof createRepo
    classes: any
}

const styles = (theme: Theme) => createStyles({
    form: {
        marginRight: 128
    },
    button: {
        display: 'block',
        textTransform: 'none',
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
    }
})

const mapStateToProps = (state: IGlobalState, props: Props) => {
    return {
        orgs: state.org.orgs,
        createRepoLoading: state.ui.createRepoLoading,
    }
}

const mapDispatchToProps = {
    createRepo
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(NewRepositoryPage))
