import React from "react";
import OverlayScrollbars from "overlayscrollbars"
import "overlayscrollbars/css/OverlayScrollbars.css"

class Scrollbar extends React.Component<any> {

    parentRef = React.createRef<HTMLDivElement>()
    osTargetRef = React.createRef<HTMLDivElement>()
    osInstance: any = null

    componentDidMount() {
        const theme = this.props.variant === 'light' ? 'os-theme-light' : 'os-theme-dark'
        const options = {
            ...(this.props.options || {}),
            className: theme,
            overflowBehavior: {
                x: 'hidden',
                y: 'auto'
            }
        }
        if (this.osTargetRef !== null) {
            this.osInstance = OverlayScrollbars(this.osTargetRef.current, options, this.props.extensions)
        }
    }

    componentDidUpdate() {
        this.osTargetRef
    }

    componentWillUnmount() {
        if (this.osInstance && this.osInstance.destroy) {
            this.osInstance.destroy()
        }
    }

    render() {
        const height = this.parentRef.current !== null ? this.parentRef.current.offsetHeight : 0
        return (
            <div {...this.props} ref={this.parentRef} style={{ height: '100%' }}>
                <div ref={this.osTargetRef} style={{ height: height }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

interface Props {
    variant: 'light' | 'dark' | undefined
    children: any
    options: any
    extensions: any
}

export default Scrollbar