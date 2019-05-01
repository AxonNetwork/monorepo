import React from "react";
import OverlayScrollbars from "overlayscrollbars"
import "overlayscrollbars/css/OverlayScrollbars.css"

class Scrollbar extends React.Component<any> {

    // parentRef = React.createRef<HTMLDivElement>()
    osTargetRef = React.createRef<HTMLDivElement>()
    osInstance: any = null

    componentDidMount() {
        const theme = this.props.variant === 'light' ? 'os-theme-light' : 'os-theme-dark'
        const options = {
            autoUpdate: true,
            autoUpdateInterval: 1000,
            className: theme,
            overflowBehavior: {
                x: 'hidden',
                y: 'auto'
            },
            ...(this.props.options || {}),
        }

        if (this.props.autoHideDelay !== undefined) {
            options.scrollbars = options.scrollbars || {}
            options.scrollbars.autoHide = 'scroll'
            options.scrollbars.autoDelay = this.props.autoHideDelay
        }

        // if (this.osTargetRef !== null) {
        console.log('this.osTargetRef.current', this.osTargetRef.current)
        this.osInstance = OverlayScrollbars(this.osTargetRef.current, options, this.props.extensions)
        // }
    }

    // componentDidUpdate() {
    //     this.osTargetRef
    // }

    componentWillUnmount() {
        if (this.osInstance && this.osInstance.destroy) {
            this.osInstance.destroy()
        }
    }

    render() {
        return (
            <div {...this.props} ref={this.osTargetRef}>
                {this.props.children}
            </div>
        )
    }
}

interface Props {
    variant: 'light' | 'dark' | undefined
    autoHideDelay?: number
    children: any
    options: any
    extensions: any
}

export default Scrollbar