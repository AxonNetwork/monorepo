declare module '*.png'

interface IWindow extends Window {
    require: (module: string) => any
}

declare var window: IWindow;
