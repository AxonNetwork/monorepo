declare module '*.png'

interface IWindow extends Window {
    require: (module: string) => any
}

declare var window: IWindow



// Type definitions for react-syntax-highlighter
// Project: https://github.com/conorhastings/react-syntax-highlighter
// Definitions by: Ivo Stratev <https://github.com/NoHomey>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

declare module 'react-syntax-highlighter/prism' {
    import SyntaxHighlighter from 'react-syntax-highlighter/light'
    export default SyntaxHighlighter
}


declare module 'tomlify-j0.4'
declare module 'toml-j0.4'


declare module 'bugsnag-react' {
    import { IPlugin } from 'bugsnag-js/types/client';
    import { BeforeSend } from 'bugsnag-js/types/common';
    import * as React from 'react';

    const createPlugin: (react: typeof React) => IPlugin;
    export default createPlugin;
    export const formatComponentStack: (str: string) => string;

    interface Props {
        beforeSend?: BeforeSend;
        FallbackComponent?: React.ComponentType<{
            error: Error;
            info: React.ErrorInfo;
        }>;
    }

    export type ErrorBoundary = React.ComponentType<Props>;
}