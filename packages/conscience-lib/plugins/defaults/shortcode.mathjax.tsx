import React from 'react'
import MathJax from 'react-mathjax'
import { URI } from 'conscience-lib/common'

export default {
    pluginType: 'markdown shortcode',
    name: 'mathjax',
    render: function(contents: string, uri: URI) {
        console.log('hihihi', contents)
        return (
            <MathJax.Provider>
                <MathJax.Node formula={contents} />
            </MathJax.Provider>
        )
    },
}
