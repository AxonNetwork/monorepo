import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import ReactMarkdown from 'react-markdown'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import Person from '@material-ui/icons/Person'
import AccessTime from '@material-ui/icons/AccessTime'
import { IOrgBlog } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'
import { IGlobalState } from 'conscience-components/redux'
import LargeProgressSpinner from 'conscience-components/LargeProgressSpinner'
import { fetchOrgBlogs  } from 'conscience-components/redux/org/orgActions'


@autobind
class BlogPage extends React.Component<Props>
{
    componentDidMount() {
        this.props.fetchOrgBlogs({ orgID: this.props.match.params.orgID })
    }
    
    render() {
        const { classes, blogs } = this.props
        if (blogs === undefined || blogs.map === undefined ) {
            return <LargeProgressSpinner/>
        }
        const blogID = this.props.match.params.blogID
        const orgID = this.props.match.params.orgID
        const blog = this.props.blogs.map[blogID]
        
        return (
            <Grid item xs={false} sm={8} className={classes.gridItem}>
                <Card className={classes.blogCard}>
                    <h1>{blog.title}</h1>
                    <div className={classes.subTitle}>
                        <div style={{marginRight: 10, display: 'flex', alignItems: 'center'}}>
                            <Person style={{height: 20, marginRight: 5}}/>
                            {blog.author}
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <AccessTime style={{height: 20, marginRight: 5}}/>
                            {moment(blog.created).calendar()}
                        </div>
                    </div>
                    <ReactMarkdown source={blog.body}/>        
                    <Link to={'/showcase/'+orgID} style={{textDecoration: 'none'}}>
                        <Button><ArrowBackIos/>Back</Button>
                    </Link>    
                </Card>
            </Grid>
        )
    }

}


interface Props {
    orgID: string
    blogID: string
    blogs: {
            map: { [created: string]: IOrgBlog }
            sortedIDs: number[],
        }
    fetchOrgBlogs: Function
    classes: any
}


interface MatchParams {
    orgID: string
    blogID: string
}

interface Props extends RouteComponentProps<MatchParams>{
    orgID: string
    blogID: string
}

const styles = () => createStyles({
    sectionHeader: {
        margin: '20px 0 30px',
    },
    card: {
        margin: '10px 0'
    },
    body: {
        lineClamp: 2,
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    gridItem: {
        padding: '60px',
    },
    blogCard: {
        padding: '20px 40px'
    },
    subTitle: {
        display: 'flex',
        flexFlow: 'row nowrap',
        padding: '10px 0'
    },
    header: {
        display: 'flex',
        flexFlow: 'row wrap',
        marginTop: 10,
        justifyContent: 'space-between'
    },
})

const mapStateToProps = (state: IGlobalState, props: RouteComponentProps<MatchParams>) => {
    return {        
        org: state.org.orgs[props.match.params.orgID],
        blogs: state.org.blogs[props.match.params.orgID] || {},
    }
}

const mapDispatchToProps = { fetchOrgBlogs }

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BlogPage))

