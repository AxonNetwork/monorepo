import React from 'react'
import Typography, { TypographyProps } from '@material-ui/core/Typography'


export function H1(props: TypographyProps) {
    return <Typography variant="h1" {...props} />
}

export function H2(props: TypographyProps) {
    return <Typography variant="h2" {...props} />
}

export function H3(props: TypographyProps) {
    return <Typography variant="h3" {...props} />
}

export function H4(props: TypographyProps) {
    return <Typography variant="h4" {...props} />
}

export function H5(props: TypographyProps) {
    return <Typography variant="h5" {...props} />
}

export function H6(props: TypographyProps) {
    return <Typography variant="h6" {...props} />
}
