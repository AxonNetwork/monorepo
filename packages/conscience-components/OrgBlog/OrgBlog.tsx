import moment from 'moment'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import RenderMarkdown from '../RenderMarkdown'
import { H5, H6 } from '../Typography/Headers'
import { IOrgBlog } from 'conscience-lib/common'
import { autobind } from 'conscience-lib/utils'


@autobind
class OrgBlog extends React.Component<Props>
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
                <Card>
                    <CardContent>
                        <List>
                            {sortedIDs.map(id => {
                                const blog = blogMap[`${id}`]
                                return (
                                    <ListItem>
                                        <div>
                                            <H6>{blog.title}</H6>
                                            <div>{blog.author}</div>
                                            <div>{moment(blog.created).calendar()}</div>
                                            <RenderMarkdown text={blog.body} />
                                        </div>
                                    </ListItem>
                                )
                            })}
                        </List>
                    </CardContent>
                </Card>
            </div>
        )
    }

    componentDidMount() {
        this.props.fetchOrgBlogs({ orgID: this.props.orgID })
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
})

export default withStyles(styles)(OrgBlog)
