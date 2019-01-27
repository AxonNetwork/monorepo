/**
 * This is a remark plugin for inserting our custom reference format ("@file[...]", etc.) into a
 * Markdown document.
 *
 * Helpful guide: https://github.com/remarkjs/remark/tree/master/packages/remark-parse#parserinlinetokenizers
 */

const REGEX = /@(\w+):\[([a-zA-Z0-9="',\-:\. \\\/\(\)\{\}\^\n\r\t\s_]+)\]/

export default function shortcodes(this: any) {
    if (isRemarkParser(this.Parser)) {
        const parser = this.Parser.prototype
        parser.inlineTokenizers.shortcode = shortcodeTokenizer
        parser.inlineMethods.splice(
            parser.inlineMethods.indexOf('escape'),
            0,
            'shortcode',
        )
    }
    if (isRemarkCompiler(this.Compiler)) {
        const compiler = this.Compiler.prototype
        compiler.visitors.shortcode = shortcodeCompiler
    }

    function locator(value: string /*, fromIndex: number*/) {
        return REGEX[Symbol.search](value)
    }

    function shortcodeTokenizer(eat: any, value: string, silent: boolean) {
        let match = REGEX.exec(value)
        if (!match || match.index !== 0) { return }

        /* Exit with true in silent mode after successful parse - never used (yet) */
        /* istanbul ignore if */
        if (silent) {
            return true
        }

        return eat(match[0])({
            type: 'shortcode',
            identifier: match[1],
            contents: match[2],
        })
    }
    shortcodeTokenizer.locator = locator

    function shortcodeCompiler(node: any) {
        return `@${node.identifier}:[${node.contents}]`
    }
}

function isRemarkParser(parser: any) {
    return Boolean(
        parser &&
        parser.prototype &&
        parser.prototype.inlineTokenizers &&
        parser.prototype.inlineTokenizers.break &&
        parser.prototype.inlineTokenizers.break.locator,
    )
}

function isRemarkCompiler(compiler: any) {
    return Boolean(compiler && compiler.prototype)
}
