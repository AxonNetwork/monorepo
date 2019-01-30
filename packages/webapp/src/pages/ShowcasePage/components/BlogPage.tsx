import moment from 'moment'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {Card, CardContent, Button} from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ReactMarkdown from 'react-markdown'
import { H5, H6 } from '../Typography/Headers'
import { IOrgBlog } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class BlogPage extends React.Component<Props>
{
    render() {
        const { blogs, limit, classes } = this.props
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
                <H5 className={classes.sectionHeader}>News and Updates</H5>
                            {sortedIDs.map(id => {
                                const blog = blogMap[`${id}`]
                                console.log(blog)
                                return (
                                    <Card className={classes.card}>
                                        <CardContent>
                                            <List>
                                                <ListItem>
                                                    <div>
                                                        <H6>{blog.title}</H6>
                                                        <div>{blog.author}</div>
                                                        <div>{moment(blog.created).calendar()}</div>
                                                        <ReactMarkdown source={this.blogSnippet(blog.body)} />
                                                        <Button onClick={() => this.handleFinishReading(blog)}>Finish Reading</Button>
                                                    </div>
                                                </ListItem>
                                            </List>
                                        </CardContent>
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

    handleFinishReading = (blog:any) => {
        
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
        margin: '10px 0'
    },
    body: {
        lineClamp: 2,
        textOverflow: 'ellipsis',
        overflow: 'hidden'
    }
})

export default withStyles(styles)(BlogPage)
