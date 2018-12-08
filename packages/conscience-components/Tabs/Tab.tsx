import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Button from '@material-ui/core/Button'

function Tab(props: {
    isActive: boolean
    onTabSelect: (event: React.MouseEvent<HTMLElement>) => void
    children: any
    classes: any
}) {
    return (
        <div className={classnames(props.classes.tab, { [props.classes.activeTab]: props.isActive })}>
            <Button onClick={ props.onTabSelect } >
                {props.children}
            </Button>
        </div>
    )
}

const styles = createStyles({
    tab: {
        height: '2.6rem',
        backgroundColor: '#f3f3f3',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontFamily: 'Helvetica',
        color: 'rgba(0, 0, 0, 0.33)',
        border: '1px solid #e4e4e4',
        borderRadius: 3,
        position: 'relative',
        top: 1,

        '& svg': {
            width: '0.8em',
            height: '0.8em',
            marginRight: 3,
            verticalAlign: 'bottom',
        },

        '& button': {
            color: 'inherit',
            textTransform: 'none',
            minWidth: 'unset',
            padding: '0 16px',
            borderRadius: 0,
            height: '100%',
            fontWeight: 400,
        },
        '& button:hover': {
            backgroundColor: 'inherit',
        },
    },
    activeTab: {
        borderBottom: 'none',
        position: 'relative',
        color: 'rgba(0, 0, 0, 0.7)',
        backgroundColor: '#fafafa',

        '& svg': {
            fill: 'rgba(0, 0, 0, 0.7)',
        },
    },
})

export default withStyles(styles)(Tab)