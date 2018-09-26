import * as π from 'pants'
import functionsIn from 'lodash/functionsIn'

// const NO_AUTOBIND = {
//     constructor: true,
//     refs: true,
//     props: true,
//     state: true,
//     getDOMNode: true,
//     setState: true,
//     replaceState: true,
//     forceUpdate: true,
//     isMounted: true,
//     setProps: true,
//     replaceProps: true,
// }

/**
     All React components that aren't created via React.createClass() need this decorator to bind `this` to all of the
    component's methods (weird, I know).

    @see https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html
*/
export default π.decorators.utils.makeClassDecorator(function(
    original_ctor: any,
    args: any[]
    ) {
        const instance: any = π.decorators.utils.construct(original_ctor, args)

        // bind all of its methods to it so that `this.whatever` works
        const funcNames = functionsIn(instance)
        // const funcNames = Object.keys(instance)
        //                         .filter(k => typeof instance[k] === 'function')
        //                         // don't autobind react's built-in component methods
        //                         .filter(k => NO_AUTOBIND[k] === undefined)

        for (const funcName of funcNames) {
        instance[funcName] = instance[funcName].bind(instance)
        }

        // give it a default non-null state, because it's annoying to have to write a constructor just to do this
        instance.state = instance.state || {}

        return instance
})