import React from 'react'
import ContentLoader from "react-content-loader"

const RepoCardLoader = (props: {}) => (
    <ContentLoader
        height={160}
        width={400}
        speed={2}
        primaryColor="#e9e9e9"
        secondaryColor="#dedede"
        {...props}
    >
        <rect x="10" y="15" rx="3" ry="3" width="270" height="20" />
        <rect x="10" y="45" rx="3" ry="3" width="310" height="10" />
        <rect x="280" y="121" rx="3" ry="3" width="45" height="30" />
        <rect x="350" y="121" rx="3" ry="3" width="45" height="30" />
    </ContentLoader>
)

export default RepoCardLoader
