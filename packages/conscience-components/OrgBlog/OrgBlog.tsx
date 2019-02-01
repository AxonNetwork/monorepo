import moment from 'moment'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import AccessTime from '@material-ui/icons/AccessTime'
import Person from '@material-ui/icons/Person'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ReactMarkdown from 'react-markdown'
import { H6 } from '../Typography/Headers'
import { IOrgBlog } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgBlog extends React.Component<Props>
{
    render() {
        const { blogs, limit, classes, orgID } = this.props
        const blogMap = blogs.map || {}
        let sortedIDs = blogs.sortedIDs || []

        if (limit !== undefined) {
            sortedIDs = sortedIDs.slice(0, limit)
        }

        if (sortedIDs.length === 0) {
            return null
        }
        return (
            <div>
                {sortedIDs.map(id => {
                    const blog = blogMap[`${id}`]
                    return (
                        <Card className={classes.card}>
                            
                                <List>
                                    <ListItem>
                                        <div>
                                            <div className={classes.header}>
                                                <H6>{blog.title}</H6>
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
                                            </div>
                                            <ReactMarkdown source={this.blogSnippet(blog.body)} />
                                            <div className={classes.link}>
                                                <Link to={'/showcase/'+orgID+'/blog/'+blog.created.toString()} style={{textDecoration: 'none'}}>
                                                    <Button>Finish Reading</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </ListItem>
                                </List>
                                    
                        </Card>
                    )
                })}
            </div>
        )
    }

    componentDidMount() {
        this.props.fetchOrgBlogs({ orgID: this.props.orgID })
    }

    blogSnippet = (blog:string) => {
        return blog.split(' ').slice(0, 50).join(' ').concat('...')
    }
  
}


interface Props {
    orgID: string
    blogs: {
        map: { [created: string]: IOrgBlog }
        sortedIDs: number[],
    }
    limit?: number
    fetchOrgBlogs: Function
    classes: any
}

const styles = () => createStyles({
    sectionHeader: {
        margin: '20px 0 30px',
    },
    card: {
        margin: '20px 0',
        padding: '10px 30px',
        paddingBottom: 0
    },
    header: {
        display: 'flex',
        flexFlow: 'row wrap',
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    subTitle: {
        display: 'flex',
        flexFlow: 'row nowrap',
    },
    body: {
        lineClamp: 2,
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    },
    link: {
        width: '100%',

    }
})

export default withStyles(styles)(OrgBlog)
