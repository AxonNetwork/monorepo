import React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { autobind, schemes } from 'conscience-lib/utils'

const syntaxStyle = {
    padding: 0,
    margin: 0,
    background: 'none',
    textShadow: 'none',
    border: 'none',
    boxShadow: 'none',
    lineHeight: 1.1,
    tabSize: 4,
    overflow: 'visible',
}

const codeTagProps = {
    style: {
        fontFamily: "Consolas, Menlo, Monaco, 'Courier New', sans-serif",
        fontWeight: 500,
        fontSize: '0.8rem',
    },
}

@autobind
class CodeViewer extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        const scheme = schemes[this.props.codeColorScheme || 'vs']
        const schemeDefaults = scheme['pre[class*="language-"]']
        const backgroundColor = this.props.backgroundColor || (schemeDefaults || {}).background
        return (
            <div className={classes.codeContainer} style={{ backgroundColor }}>
                <SyntaxHighlighter style={scheme} language={this.props.language} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                    {this.props.fileContents || ''}
                </SyntaxHighlighter>
            </div>
        )
    }
}

interface Props {
    language: string
    fileContents: string
    codeColorScheme: string | undefined
    backgroundColor?: string
    classes: any
}

const styles = () => createStyles({
    codeContainer: {
        padding: 30,
        overflowX: 'scroll',
    },
})

export default withStyles(styles)(CodeViewer)
