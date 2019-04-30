import { URI } from 'conscience-lib/common'

export type PluginType = 'file type' | 'file viewer' | 'file editor' | 'markdown shortcode'

/**
 * file type
 */

export interface IFileType {
    extensions: string[]
    type: string
    humanReadableType: string
    language?: string
    isTextFile: boolean
    viewers: string[]
    editors: string[]
    iconComponent: React.ComponentType<{}>
}

export interface IFileTypePlugin {
    pluginType: 'file type'
    fileTypes: IFileType[]
}

/**
 * viewer
 */

export interface IFileViewerPlugin {
    pluginType: 'file viewer'
    name: string
    humanName: string
    viewer: FileViewerComponentClass
    widthMode: WidthMode
}

export type WidthMode = 'full' | 'breakpoints' | 'unset'

export type FileViewerComponentClass = React.ComponentClass<IFileViewerPluginProps>

export interface IFileViewerPluginProps {
    uri: URI
    fileContents?: string
    classes: any
}

/**
 * editor
 */

export interface IFileEditorPlugin {
    pluginType: 'file editor'
    name: string
    humanName: string
    editor: FileEditorComponentClass
    showSaveButton: boolean
}

export type FileEditorComponentClass = React.ComponentClass<IFileEditorPluginProps>

export type FileEditorComponent = React.Component<IFileEditorPluginProps> & {
    onClickSave: () => void
}

export interface IFileEditorPluginProps {
    uri: URI
    isNewFile: boolean
    setFileModified: (fileModified: boolean) => void
    classes?: any
}

/**
 * markdown shortcode
 */

export interface IMarkdownShortcodePlugin {
    pluginType: 'markdown shortcode',
    name: string
    render: MarkdownShortcodeRenderFunc
}

export type MarkdownShortcodeRenderFunc = (contents: string, uri: URI) => JSX.Element

export type IPlugin =
    IFileTypePlugin |
    IFileViewerPlugin |
    IFileEditorPlugin |
    IMarkdownShortcodePlugin

