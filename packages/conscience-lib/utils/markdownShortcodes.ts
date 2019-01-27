import keyBy from 'lodash/keyBy'
import { URI } from 'conscience-lib/common'
import { getPlugins, IMarkdownShortcodePlugin } from '../plugins'

let plugins: { [name: string]: IMarkdownShortcodePlugin }

export function renderShortcode(name: string, contents: string, uri: URI) {
    console.log('renderShortcode', name)
    if (!plugins) {
        const pluginList = getPlugins('markdown shortcode') as IMarkdownShortcodePlugin[]
        plugins = keyBy(pluginList, 'name')
    }

    const plugin = plugins[name]
    if (!plugin) {
        return null
    }

    return plugin.render(contents, uri)
}