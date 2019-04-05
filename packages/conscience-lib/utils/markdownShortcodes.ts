import keyBy from 'lodash/keyBy'
import { URI } from 'conscience-lib/common'
import { getPlugins } from '../plugins'
import { IMarkdownShortcodePlugin } from '../plugins/types'

let plugins: { [name: string]: IMarkdownShortcodePlugin }

export function renderShortcode(name: string, contents: string, uri: URI) {
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