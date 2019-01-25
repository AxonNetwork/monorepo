import React from 'react'
import { connect } from 'react-redux'
import { withStyles, createStyles } from '@material-ui/core/styles'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { autobind, schemes } from 'conscience-lib/utils'
import { IUserState } from 'conscience-components/redux/user/userReducer'


@autobind
class CodeViewer extends React.Component<Props>
{
    render() {
        const { classes } = this.props
        const scheme = (schemes as any)[this.props.codeColorScheme || 'pojoaque']
        const schemeDefaults = scheme['pre[class*="language-"]']
        const backgroundColor = this.props.backgroundColor || (schemeDefaults || {}).background
        return (
            <div className={classes.codeContainer} style={{ backgroundColor }}>
                <SyntaxHighlighter style={scheme} language={this.props.language} customStyle={{ ...syntaxStyle, ...this.props.syntaxStyle }} codeTagProps={codeTagProps as any}>
                    {this.props.fileContents || ''}
                </SyntaxHighlighter>
            </div>
        )
    }
}

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

type Props = OwnProps & StateProps & { classes: any }

interface OwnProps {
    language: string
    fileContents: string
    syntaxStyle?: React.CSSProperties
    backgroundColor?: string
}

interface StateProps {
    codeColorScheme: string | undefined
}

const styles = () => createStyles({
    codeContainer: {
        padding: 30,
        overflowX: 'auto',
    },
})

const mapStateToProps = (state: { user: IUserState }) => {
    return {
        codeColorScheme: state.user.userSettings.codeColorScheme,
    }
}

export default connect(mapStateToProps, null)(withStyles(styles)(CodeViewer))
