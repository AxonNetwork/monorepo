import functionsIn from 'lodash/functionsIn'
import { makeClassDecorator, construct } from './decorators'

/**
     All React components that aren't created via React.createClass() need this decorator to bind `this` to all of the
    component's methods (weird, I know).

    @see https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html
*/
const autobind = makeClassDecorator(function(
    original_ctor: any,
    args: any[]
) {
    const instance: any = construct(original_ctor, args)

    // bind all of its methods to it so that `this.whatever` works
    for (const funcName of functionsIn(instance)) {
        instance[funcName] = instance[funcName].bind(instance)
    }

    // give it a default non-null state, because it's annoying to have to write a constructor just to do this
    instance.state = instance.state || {}

    return instance
})

export default autobind