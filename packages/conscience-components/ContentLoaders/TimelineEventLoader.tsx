import React from 'react'
import ContentLoader from "react-content-loader"

const TimelineEventLoader = (props: {}) => (
    <ContentLoader
        height={50}
        width={140}
        speed={2}
        primaryColor="#e9e9e9"
        secondaryColor="#dedede"
        style={{ width: 280 }}
        {...props}
    >
        <circle cx="22" cy="30" r="12" />
        <rect x="40" y="18" rx="3" ry="3" width="100" height="8" />
        <rect x="40" y="30" rx="3" ry="3" width="60" height="5" />
        <rect x="40" y="38" rx="3" ry="3" width="100" height="5" />
    </ContentLoader>
)

export default TimelineEventLoader