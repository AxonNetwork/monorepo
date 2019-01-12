import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import RenderMarkdown from '../RenderMarkdown'
import { H6 } from '../Typography/Headers'
import { IOrgBlog } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgBlog extends React.Component<Props>
{
    render() {
        const { blogs, limit } = this.props
        const blogMap = blogs.map || {}
        let sortedIDs = blogs.sortedIDs || []

        if (limit !== undefined) {
            sortedIDs = sortedIDs.slice(0, limit)
        }

        return (
            <Card>
                <CardContent>
                    <List>
                        {sortedIDs.map(id => {
                            const blog = blogMap[`${id}`]
                            return (
                                <ListItem>
                                    <H6>{blog.title}</H6>
                                    <div>{blog.author}</div>
                                    <div>{blog.created}</div>
                                    <RenderMarkdown text={blog.body} />
                                </ListItem>
                            )
                        })}
                    </List>
                </CardContent>
            </Card>
        )
    }

    componentDidMount() {
        this.props.fetchOrgBlogs({ orgID: this.props.orgID })
    }
}


interface Props {
    orgID: string
    blogs: {
        map: {[created: string]: IOrgBlog}
        sortedIDs: number[],
    }
    limit?: number

    fetchOrgBlogs: Function

    classes: any
}

const styles = () => createStyles({
})

export default withStyles(styles)(OrgBlog)
