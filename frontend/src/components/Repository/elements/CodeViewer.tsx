import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import autobind from 'utils/autobind'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { setCodeColorScheme } from 'redux/user/userActions'
import { IGlobalState } from 'redux/store'
import getLanguage from 'utils/getLanguage'
const schemes = require('react-syntax-highlighter/styles/prism')


const syntaxStyle = {
    padding: 0,
    margin: 0,
    background: 'none',
    textShadow: 'none',
    border: 'none',
    boxShadow: 'none',
    lineHeight: 1.1,
    tabSize: 4,
}

const codeTagProps = {
    style: {
        fontFamily: "Consolas, Menlo, Monaco, 'Courier New', sans-serif",
        fontWeight: 500,
        fontSize: '0.8rem',
    },
}

@autobind
class CodeViewer extends React.Component<Props, State>
{
    render() {
        const { classes } = this.props
        const scheme = schemes[this.props.codeColorScheme || Object.keys(schemes)[0]]
        const schemeDefaults = scheme['pre[class*="language-"]']
        const backgroundColor = (schemeDefaults || {}).background
        return (
            <div>
                {this.props.showColorSelector &&
                    <Select onChange={this.onChangeCodeColorScheme} value={this.props.codeColorScheme}>
                        {Object.keys(schemes).map(s => (
                            <MenuItem value={s}>{s}</MenuItem>
                        ))}
                    </Select>
                }
                <div className={classes.codeContainer} style={{ backgroundColor }}>
                    <SyntaxHighlighter style={scheme} language={getLanguage(this.props.language)} customStyle={syntaxStyle} codeTagProps={codeTagProps as any}>
                        {this.props.contents || ''}
                    </SyntaxHighlighter>
                </div>
            </div>
        )
    }

    onChangeCodeColorScheme(evt: any) {
        this.props.setCodeColorScheme({ codeColorScheme: evt.target.value })
    }
}

interface Props {
    language: string
    contents: string
    codeColorScheme: string | undefined
    showColorSelector?: boolean
    setCodeColorScheme: typeof setCodeColorScheme
    classes: any
}

interface State {
    fileContents: string
    error: Error | undefined
    codeColorScheme: string
}

const styles = () => createStyles({
    imageEmbed: {
        maxWidth: '100%',
    },
    codeContainer: {
        padding: 30,
    },
})

const mapStateToProps = (state: IGlobalState) => {
    return {
        codeColorScheme: state.user.codeColorScheme,
    }
}

const mapDispatchToProps = {
    setCodeColorScheme,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CodeViewer))

