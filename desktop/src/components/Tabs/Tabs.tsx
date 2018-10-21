import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Tab from './Tab'
import HomeIcon from '@material-ui/icons/Home'
import SettingsIcon from '@material-ui/icons/Settings'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import DescriptionIcon from '@material-ui/icons/Description'
import HistoryIcon from '@material-ui/icons/History'
import CommentIcon from '@material-ui/icons/Comment'


function Tabs(props: {
    pages: [number, string][] //number is page enum
    activePage: number
    onTabSelect: (page: number) => void
    menuLabelsHidden: boolean
    classes: any
}) {
    return (
        <div className={props.classes.root}>
            {props.pages.map((option: [number, string]) => {
                const icon = getIcon(option[1])
                return(
                    <Tab
                        isActive={props.activePage === option[0]}
                        onTabSelect={()=>props.onTabSelect(option[0])}
                    >
                    {icon}
                    {props.menuLabelsHidden ? '' : option[1]}
                    </Tab>
                )
            })}
        </div>
    )
}

function getIcon(tab: string){
    switch(tab){
        case 'Home':
            return <HomeIcon />
        case 'Settings':
            return <SettingsIcon />
        case 'Files':
            return <FolderOpenIcon />
        case 'Manuscript':
            return <DescriptionIcon />
        case 'History':
            return <HistoryIcon />
        case 'Discussion':
            return <CommentIcon />
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
        marginLeft: 100,
        marginRight: 60,
    },
})

export default withStyles(styles)(Tabs)