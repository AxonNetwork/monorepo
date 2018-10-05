import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import autobind from 'utils/autobind'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { IGlobalState } from 'redux/store'
import getLanguage from 'utils/getLanguage'
import schemes from 'utils/codeColorSchemes'

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
        const backgroundColor = (schemeDefaults || {}).background
        return (
            <div>
                <div className={classes.codeContainer} style={{ backgroundColor }}>
                    <SyntaxHighlighter style={scheme} language={getLanguage(this.props.language)} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                        {this.props.contents || ''}
                    </SyntaxHighlighter>
                </div>
            </div>
        )
    }
}

interface Props {
    language: string
    contents: string
    codeColorScheme: string | undefined
    showColorSelector?: boolean
    classes: any
}

const styles = () => createStyles({
    codeContainer: {
        padding: 30,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        codeColorScheme: state.user.codeColorScheme,
    }
}

const mapDispatchToProps = { }

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CodeViewer))

