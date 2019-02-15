import React from 'react'
import ContentLoader from "react-content-loader"

const CommentLoader = (props: {}) => (
    <ContentLoader
        height={130}
        width={700}
        speed={2}
        primaryColor="#e9e9e9"
        secondaryColor="#dedede"
        {...props}
    >
        <circle cx="40" cy="50" r="24" />
        <rect x="80" y="20" rx="5" ry="5" width="600" height="15" />
        <rect x="80" y="40" rx="5" ry="5" width="600" height="15" />
        <rect x="80" y="60" rx="5" ry="5" width="600" height="15" />
        <rect x="80" y="80" rx="5" ry="5" width="600" height="15" />
        <rect x="80" y="100" rx="5" ry="5" width="400" height="15" />
    </ContentLoader>
)

export default CommentLoader
