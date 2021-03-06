import classnames from 'classnames'
import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Tab from './Tab'
import HomeIcon from '@material-ui/icons/Home'
import SettingsIcon from '@material-ui/icons/Settings'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import HistoryIcon from '@material-ui/icons/History'
import CommentIcon from '@material-ui/icons/Comment'
import PeopleIcon from '@material-ui/icons/People'


function Tabs<T extends number>(props: {
    pages: [T, string][] // number is page enum
    activePage: T
    onTabSelect: (page: T) => void
    menuLabelsHidden: boolean
    classes: any,
    className?: string
}) {
    return (
        <div className={classnames(props.classes.root, props.className)}>
            {props.pages.map((option: [T, string]) => {
                const icon = getIcon(option[1])
                return (
                    <Tab
                        isActive={props.activePage === option[0]}
                        onTabSelect={() => props.onTabSelect(option[0])}
                        key={option.toString()}
                    >
                        {icon}
                        {props.menuLabelsHidden ? '' : option[1]}
                    </Tab>
                )
            })}
        </div>
    )
}

function getIcon(tab: string) {
    switch (tab) {
        case 'Home':
            return <HomeIcon />
        case 'Settings':
            return <SettingsIcon />
        case 'Files':
            return <FolderOpenIcon />
        case 'History':
            return <HistoryIcon />
        case 'Discussion':
            return <CommentIcon />
        case 'Team':
            return <PeopleIcon />
    }
    return null
}

const styles = createStyles({
    root: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexGrow: 1,
        maxWidth: 510,
        marginRight: 60,
    },
})

export default withStyles(styles)(Tabs)
