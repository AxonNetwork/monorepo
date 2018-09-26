import React from 'react'

export interface EventTitleProps {
    version: number
    user: string
    files: string[] | string
}

function EventTitle(props: EventTitleProps) {
    const user = props.user || 'Someone'
    const { files, version } = props
    let filesString
    if (typeof files === 'string') {
        filesString = files
    }else {
        filesString = files.reduce((acc: JSX.Element[], curr: string, i: number) => {
            acc.push(<code key={i}>{curr}</code>)
            if (files.length - i > 2) { acc.push(<span>, </span>) }
            if (files.length - i == 2) { acc.push(<span> and </span>) }
            return acc
        }, [])
    }
    return <span><strong>v{version}: {user}</strong> edited {filesString}</span>
}

export default EventTitle